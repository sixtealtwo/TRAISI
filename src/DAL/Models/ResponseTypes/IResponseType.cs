namespace DAL.Models.ResponseTypes
{
    public interface IResponseType<T>
    {
        int Id{get;set;}

        T Value{get;set;}



         
    }
}