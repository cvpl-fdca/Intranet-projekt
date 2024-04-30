import validator from "validator";
type EventData = {
    authorUID: string,
    authorName: string,
    eventStart: string,
    eventEnd: string,
    description:  string,
    timeCreated: string,
    title: string,
}

export function validateData(eventData: EventData) {
    if(!validator.isAlpha(eventData.authorUID)) {
        return false;
    } if(!validator.isAlpha(eventData.authorName, 'da-DK', {ignore: ' '})) {
        return false;
    } if(!validator.whitelist(eventData.eventStart, '\d{4}-\d{2}-\d{2} \d{2}:\d{2}')) {
        return false;
    } if(!validator.whitelist(eventData.eventEnd, '\d{4}-\d{2}-\d{2} \d{2}:\d{2}')) {
        return false;
    } if(false) { // TO DO - input validation on description
        return false;
    } if(!validator.whitelist(eventData.timeCreated, '\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}[+-]\d{2}:\d{2}')) {
        return false;
    } if(false) { // TO DO - input validation on description
        return false;
    }
    return true;
}