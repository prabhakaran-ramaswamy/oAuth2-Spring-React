package com.example;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.URL;
import javax.net.ssl.HttpsURLConnection;

public class MainApiClient {
    public static void main(String[] args) {
        try {
            // Enable SSL handshake debug logs
            System.setProperty("javax.net.debug", "ssl,handshake");
            // Set the trust store properties for SSL handshake
        	System.setProperty("javax.net.ssl.trustStore", "D:\\eclipse-w\\jpa-ssl\\truststore.p12");
        	System.setProperty("javax.net.ssl.trustStorePassword", "changeit");
        	System.setProperty("javax.net.ssl.trustStoreType", "PKCS12");


            String url = "https://localhost:8443/api/employees";
            URL obj = new URL(url);
            HttpsURLConnection con = (HttpsURLConnection) obj.openConnection();
            con.setRequestMethod("GET");

            int responseCode = con.getResponseCode();
            System.out.println("GET Response Code :: " + responseCode);

            if (responseCode == HttpsURLConnection.HTTP_OK) {
                BufferedReader in = new BufferedReader(new InputStreamReader(con.getInputStream()));
                String inputLine;
                StringBuilder response = new StringBuilder();

                while ((inputLine = in.readLine()) != null) {
                    response.append(inputLine);
                }
                in.close();

                // Print the response
                System.out.println(response.toString());
            } else {
                System.out.println("GET request failed");
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}