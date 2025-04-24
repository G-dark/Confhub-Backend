export interface IEvent{
    suscribeToAnEvent(eventid:Number): boolean;
    unSuscribeFromAnEvent(eventid:Number): boolean;
    isSubscribed(eventid:Number):boolean;

}