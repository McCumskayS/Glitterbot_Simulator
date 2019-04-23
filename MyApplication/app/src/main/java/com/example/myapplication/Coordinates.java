package com.example.myapplication;

/**
 * https://github.com/Lezh1k
 * Class used to handle coordinates.
 */
public class Coordinates {
    private static final double EARTH_RADIUS = 6371.0 * 1000.0; // meters

    /**
     * finds the distance between 2 coordinates.
     * @param lon1 - first longitude value.
     * @param lat1 - first latitude value.
     * @param lon2 - second longitude value.
     * @param lat2 - second latitude value.
     * @return distance of between the 2 values.
     */
    public static double distanceBetween(double lon1, double lat1, double lon2, double lat2) {
        double deltaLon = Math.toRadians(lon2 - lon1);
        double deltaLat = Math.toRadians(lat2 - lat1);
        double a =
                Math.pow(Math.sin(deltaLat / 2.0), 2.0) +
                        Math.cos(Math.toRadians(lat1)) *
                                Math.cos(Math.toRadians(lat2)) *
                                Math.pow(Math.sin(deltaLon/2.0), 2.0);
        double c = 2.0 * Math.atan2(Math.sqrt(a), Math.sqrt(1.0-a));
        return EARTH_RADIUS * c;
    }

    /**
     * converts longitude into meters.
     * @param lon - the default longitude value passed in.
     * @return longitude converted into meters.
     */
    public static double longitudeToMeters(double lon) {
        double distance = distanceBetween(lon, 0.0, 0.0, 0.0);
        return distance * (lon < 0.0 ? -1.0 : 1.0);
    }

    /**
     * converts the lonitude and latitude that is in meters into a geopoint value.
     * @param lonMeters - longitude in meters.
     * @param latMeters - latitude in meters.
     * @return geopoint value for the long and lat values.
     */
    public static GeoPoint metersToGeoPoint(double lonMeters, double latMeters) {
        GeoPoint point = new GeoPoint(0.0, 0.0);
        GeoPoint pointEast = pointPlusDistanceEast(point, lonMeters);
        GeoPoint pointNorthEast = pointPlusDistanceNorth(pointEast, latMeters);
        return pointNorthEast;
    }

    /**
     * converts latitde into meters.
     * @param lat - default latitude value.
     * @return latitude converted into meters.
     */
    public static double latitudeToMeters(double lat) {
        double distance = distanceBetween(0.0, lat, 0.0, 0.0);
        return distance * (lat < 0.0 ? -1.0 : 1.0);
    }

    /**
     * calculations behind finding the geopoint value.
     * @return updated geopoint object.
     */
    private static GeoPoint getPointAhead(GeoPoint point, double distance, double azimuthDegrees) {
        double radiusFraction = distance / EARTH_RADIUS;
        double bearing = Math.toRadians(azimuthDegrees);

        double lat1 = Math.toRadians(point.Latitude);
        double lng1 = Math.toRadians(point.Longitude);

        double lat2_part1 = Math.sin(lat1) * Math.cos(radiusFraction);
        double lat2_part2 = Math.cos(lat1) * Math.sin(radiusFraction) * Math.cos(bearing);
        double lat2 = Math.asin(lat2_part1 + lat2_part2);

        double lng2_part1 = Math.sin(bearing) * Math.sin(radiusFraction) * Math.cos(lat1);
        double lng2_part2 = Math.cos(radiusFraction) - Math.sin(lat1) * Math.sin(lat2);
        double lng2 = lng1 + Math.atan2(lng2_part1, lng2_part2);

        lng2 = (lng2 + 3.0*Math.PI) % (2.0*Math.PI) - Math.PI;

        GeoPoint res = new GeoPoint(Math.toDegrees(lat2), Math.toDegrees(lng2));
        return res;
    }

    private static GeoPoint pointPlusDistanceEast(GeoPoint point, double distance) {
        return getPointAhead(point, distance, 90.0);
    }

    private static GeoPoint pointPlusDistanceNorth(GeoPoint point, double distance) {
        return getPointAhead(point, distance, 0.0);
    }
}
