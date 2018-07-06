using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using DAL.Models.Surveys;
using System.Linq;
using System.Collections.ObjectModel;
using System.Collections.Specialized;

namespace DAL.Models.Questions
{
    public class QuestionOption : IQuestionOption
    {
        public int Id { get; set; }


        public string Name { get; set; }

        [NotMapped]
        public ICollection<Label> Values { get;set; }

        public ICollection<QuestionOptionLabel> QuestionOptionLabels { get; set; }

        public string Description { get; set; }


        public QuestionOption()
        {
            //Values = new HashSet<Label>();
            QuestionOptionLabels = new HashSet<QuestionOptionLabel>();
            Values = new ObservableCollection<Label>();

            ((ObservableCollection<Label>)Values).CollectionChanged += ValuesCollectionChanged;

        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private void ValuesCollectionChanged(object sender, NotifyCollectionChangedEventArgs e)
        {
            //remove OldItems from QuestionOptionLabels
            if (e.Action == NotifyCollectionChangedAction.Remove)
            {
                foreach (var old in e.OldItems)
                {
                    QuestionOptionLabels.Remove(QuestionOptionLabels.SingleOrDefault(l => l.Label == old));
                }
            }
            else if (e.Action == NotifyCollectionChangedAction.Add)
            {
                foreach (var newItem in e.NewItems)
                {
                    QuestionOptionLabels.Add(new QuestionOptionLabel()
                    {
                        Label = newItem as Label,
                        QuestionOption = this
                    });
                }
            }
        }





    }
}