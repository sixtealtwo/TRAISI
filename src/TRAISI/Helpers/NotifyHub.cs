using System;
using System.Collections.Generic;
using System.Collections.Concurrent;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;
using Microsoft.AspNetCore.Authorization;

namespace TRAISI.Helpers
{
    public interface ITypedHubClient: IClientProxy
    {
        Task BroadcastMessage(string type, string payload);
    }
    [Authorize]
    public class NotifyHub : Hub
    {
        public class NotifyMessage
        {
            public string UserName { get; set; }
            public string Message { get; set; }
        }

				public class DownloadProgress
				{
					public string Id { get; set; }
					public double Progress { get; set; }
					public string Url { get; set; }
				}

        public static readonly object _messagesLock = new object();
        public static List<NotifyMessage> priorMessages = new List<NotifyMessage>();
        public NotifyHub()
        {
        }
        public async Task SendToAll(string message)
        {
						NotifyMessage newMessage = new NotifyMessage() { UserName = this.Context.User.Identity.Name, Message = message };
            lock (_messagesLock)
            {
                NotifyHub.priorMessages.Add(newMessage);
            }

            await Clients.All.SendAsync("sendToAll", newMessage);
        }

        public async Task SendMessageToCaller(string message)
        {
            await Clients.Caller.SendAsync("sendToAll", message);
        }

        public void SendPriorMessageToCaller(NotifyMessage message)
        {
            Clients.Caller.SendAsync("sendToAll", message);
        }

        public async Task SendMessageToGroups(string message)
        {
            List<string> groups = new List<string>() { "SignalR Users" };
            await Clients.Groups(groups).SendAsync("ReceiveMessage", message);
        }

        public void GetPriorMessages()
        {
            lock (_messagesLock)
            {
                foreach (var message in priorMessages)
                {
                    this.SendPriorMessageToCaller(message);
                }
            }
        }

        public override async Task OnConnectedAsync()
        {

            await Groups.AddToGroupAsync(Context.ConnectionId, "SignalR Users");
            await base.OnConnectedAsync();
        }

        public override async Task OnDisconnectedAsync(Exception exception)
        {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, "SignalR Users");
            await base.OnDisconnectedAsync(exception);
        }

				public async void SendDownloadUpdate(DownloadProgress progress) {
					 await this.Clients.User(this.Context.UserIdentifier).SendAsync("downloadUpdate", progress);
				}
    }
}
