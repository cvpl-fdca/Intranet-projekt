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
    if(!validator.isAlphanumeric(eventData.authorUID)) {
        console.log(eventData.authorUID);
        console.log("Validation failed on authorUID");
        return false;
    } if(!validator.isAlpha(eventData.authorName, 'da-DK', {ignore: ' '})) {
        console.log("Validation failed on authorName");
        return false;
    } if(!validator.whitelist(eventData.eventStart, '\\d{4}-\\d{2}-\\d{2} \\d{2}:\\d{2}')) {
        console.log("Validation failed on eventStart");
        return false;
    } if(!validator.whitelist(eventData.eventEnd, '\\d{4}-\\d{2}-\\d{2} \\d{2}:\\d{2}')) {
        console.log("Validation failed on eventEnd");
        return false;
    } if(!validator.isAlpha(eventData.title, 'da-DK', {ignore: ' '}) || !validator.isLength(eventData.title, {min: 1, max: 20})) { // TO DO - input validation on description
        console.log("Validation failed on title");
        return false;
    } if(!validator.whitelist(eventData.timeCreated, '\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}[+-]\\d{2}:\\d{2}')) {
        return false;
    } if(!validator.whitelist(eventData.description, '[a-zA-Z0-9æøåÆØÅ ,.\'!?]:()/&-<>')) {
        return false;
    }
    return true;
}