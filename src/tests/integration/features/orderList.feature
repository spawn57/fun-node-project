Feature: Order List
    As an end user
    I want to list all the orders

    Scenario: see my order in the list
        Given the latest order
        When I make a request for the list of orders 
        Then the order list request should be successful
        Then my new order should be there