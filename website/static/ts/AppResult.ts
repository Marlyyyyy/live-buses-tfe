/**
 * This Generic interface defines the 'contract function' which would be passed by a requesting function for content from the server
 * The requesting function would provide a function matching this description which would be called and populated when the ajax
 * request finishes executing
 */
interface AppResult<T>{
    (result: Array<T>, wasSuccessful: boolean): void;
}