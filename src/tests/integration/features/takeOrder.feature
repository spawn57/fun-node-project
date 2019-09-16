Feature: Take Order
    As an end user
    I want to take an Order
    Then the order will be set to taken

    Scenario: take an order
        Given an order exists with id 1 and status UNASSIGNED
        When I send a patch request with id 1 and status TAKEN
        Then the status should be SUCCESS 

    Scenario: take two orders at the same time
        Given an order exists with id 1 and status UNASSIGNED
        When I send two patch requests with id 1 and status TAKEN
        Then one should succeed and the other should fail