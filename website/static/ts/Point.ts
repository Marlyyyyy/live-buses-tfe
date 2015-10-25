class Point{
    constructor(private latitude: number, private longitude: number){}
    public getLatitude(): number{
        return this.latitude;
    }
    public getLongitude(): number{
        return this.longitude;
    }
    public toString(): string{
        return this.latitude + "," + this.longitude;
    }
}