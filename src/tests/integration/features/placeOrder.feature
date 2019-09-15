Feature: Place Order
    As an end user
    I want to place an Order

    Scenario: place an Order
        When I post a request with origin coordinates '22.314383','114.107773' and destination coordinates '22.500367','114.156597'
        Then the place order request should be successful
        Then the distance should be 34515 and status should be unassigned