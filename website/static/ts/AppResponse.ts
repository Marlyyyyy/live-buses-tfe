/**
 * This interface defines a json request contract. Any function requesting information from the server supplies a function
 * matching this interface which would be called an populated after the json request
 */

interface AppResponse{
    (json: any, wasSuccessful: boolean): void;
}