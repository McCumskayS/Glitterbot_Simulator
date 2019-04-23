package com.example.myapplication;

/**
 * Geopoint class that sets up geopoint object.
 */
public class GeoPoint {
    //variable declarations
    public double Latitude;
    public double Longitude;

    /**
     * constructor for the geopoint class that sets up long and lat.
     * @param latitude - latitude value you want to set the geopoint up with.
     * @param longitude - longitude value you want to set the geopoint up with.
     */
    public GeoPoint(double latitude, double longitude) {
        Latitude = latitude;
        Longitude = longitude;
    }
}
