// ====================================================
// More Templates: https://www.ebenmonney.com/templates
// Email: support@ebenmonney.com
// ====================================================

using MailKit.Net.Smtp;
using MimeKit;
using System;
using System.Text;
using System.Collections.Generic;
using Microsoft.Extensions.Logging;
using System.Threading.Tasks;
using System.Security.Cryptography.X509Certificates;
using System.Net.Security;
using Microsoft.Extensions.Options;
using RestSharp;
using RestSharp.Authenticators;

namespace TRAISI.Helpers
{
    public interface IMailgunMailer
    {
        Task<(bool success, string errorMsg)> SendEmailAsync(MailgunEmail emailSettings);
    }

    public class MailgunMailer: IMailgunMailer
    {
        private MailgunConfig _config;
        private Dictionary<string, string> templates;

        public MailgunMailer(IOptions<MailgunConfig> config)
        {
            this._config = config.Value;
        }

        private void loadTemplates()
        {

        }

        public async Task<(bool success, string errorMsg)> SendEmailAsync(MailgunEmail emailSettings)
        {
            IRestResponse sendResult = await this.SendViaMailgunAsync(emailSettings);
            if (sendResult.IsSuccessful)
            {
                return (true, "Successfully sent email");
            }
            else
            {
                return (false, sendResult.ErrorMessage);
            }
        }

        private async Task<IRestResponse> SendViaMailgunAsync(MailgunEmail emailSettings)
        {
            RestClient client = new RestClient();
            client.BaseUrl = new Uri(this._config.MailGunUrl);
            client.Authenticator = new HttpBasicAuthenticator("api", this._config.APIKey);
            RestRequest request = new RestRequest();
            request.AddParameter("domain",
                                 this._config.Domain, ParameterType.UrlSegment);
            request.Resource = "{domain}/messages";
            request.AddParameter("from", this._config.Sender);
            request.AddParameter("h:Reply-To", this._config.ReplyTo);
            request.AddParameter("to", emailSettings.Receipient);
            request.AddParameter("subject", emailSettings.Subject);
            if (emailSettings.DeliveryTime != null && emailSettings.DeliveryTime != DateTime.MinValue)
            {
                request.AddParameter("o:deliverytime", emailSettings.DeliveryTime);
            }

            if (emailSettings.Tags != null)
            {
                foreach (var tag in emailSettings.Tags)
                {
                    request.AddParameter("o:tag", tag);
                }
            }

            string htmlText = EmailTemplates.GetTemplate(emailSettings.Template, emailSettings.TemplateReplacements);
            request.AddParameter("html", htmlText);
            request.Method = Method.POST;
            return await client.ExecuteTaskAsync(request);
        }
    }

    public class MailgunConfig
    {
        public string Domain { get; set; }
        public string Sender { get; set; }
        public string ReplyTo { get; set; }
        public string MailGunUrl { get; set; }
        public string APIKey { get; set; }
    }

    public class MailgunEmail
    {
        public string Receipient { get; set; }
        public DateTime DeliveryTime { get; set; }
        public string Subject { get; set; }
        public string Template { get; set; }
        public Dictionary<string,string> TemplateReplacements { get; set; }
        public string[] Tags { get; set; }
    }


    public interface IEmailer
    {
        Task<(bool success, string errorMsg)> SendEmailAsync(MailboxAddress sender, MailboxAddress[] recepients, string subject, string body, SmtpConfig config = null, bool isHtml = true);
        Task<(bool success, string errorMsg)> SendEmailAsync(string recepientName, string recepientEmail, string subject, string body, SmtpConfig config = null, bool isHtml = true);
        Task<(bool success, string errorMsg)> SendEmailAsync(string senderName, string senderEmail, string recepientName, string recepientEmail, string subject, string body, SmtpConfig config = null, bool isHtml = true);
    }

    public class Emailer : IEmailer
    {
        private SmtpConfig _config;


        public Emailer(IOptions<SmtpConfig> config)
        {
            _config = config.Value;
        }


        public async Task<(bool success, string errorMsg)> SendEmailAsync(string recepientName, string recepientEmail,
            string subject, string body, SmtpConfig config = null, bool isHtml = true)
        {
            var from = new MailboxAddress(_config.Name, _config.EmailAddress);
            var to = new MailboxAddress(recepientName, recepientEmail);

            return await SendEmailAsync(from, new MailboxAddress[] { to }, subject, body, config, isHtml);
        }



        public async Task<(bool success, string errorMsg)> SendEmailAsync(string senderName, string senderEmail,
            string recepientName, string recepientEmail,
            string subject, string body, SmtpConfig config = null, bool isHtml = true)
        {
            var from = new MailboxAddress(senderName, senderEmail);
            var to = new MailboxAddress(recepientName, recepientEmail);

            return await SendEmailAsync(from, new MailboxAddress[] { to }, subject, body, config, isHtml);
        }



        public async Task<(bool success, string errorMsg)> SendEmailAsync(MailboxAddress sender, MailboxAddress[] recepients, string subject, string body, SmtpConfig config = null, bool isHtml = true)
        {
            MimeMessage message = new MimeMessage();

            message.From.Add(sender);
            message.To.AddRange(recepients);
            message.Subject = subject;
            message.Body = isHtml ? new BodyBuilder { HtmlBody = body }.ToMessageBody() : new TextPart("plain") { Text = body };

            try
            {
                if (config == null)
                    config = _config;

                using (var client = new SmtpClient())
                {
                    if (!config.UseSSL)
                        client.ServerCertificateValidationCallback = (object sender2, X509Certificate certificate, X509Chain chain, SslPolicyErrors sslPolicyErrors) => true;

                    await client.ConnectAsync(config.Host, config.Port, config.UseSSL).ConfigureAwait(false);
                    client.AuthenticationMechanisms.Remove("XOAUTH2");

                    if (!string.IsNullOrWhiteSpace(config.Username))
                        await client.AuthenticateAsync(config.Username, config.Password).ConfigureAwait(false);

                    await client.SendAsync(message).ConfigureAwait(false);
                    await client.DisconnectAsync(true).ConfigureAwait(false);
                }

                return (true, null);
            }
            catch (Exception ex)
            {
                Utilities.CreateLogger<Emailer>().LogError(LoggingEvents.SEND_EMAIL, ex, "An error occurred whilst sending email");
                return (false, ex.Message);
            }
        }
    }



    public class SmtpConfig
    {
        public string Host { get; set; }
        public int Port { get; set; }
        public bool UseSSL { get; set; }

        public string Name { get; set; }
        public string Username { get; set; }
        public string EmailAddress { get; set; }
        public string Password { get; set; }
    }
}
