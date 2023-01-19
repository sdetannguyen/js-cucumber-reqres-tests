@browser
@dashboard
Feature: Dashboard test

    Background: Background steps
        Given I navigate to dashboard page

    @test01
    Scenario: Scenario steps
        When I click Support Reqres button
        Then The page is auto-scrolled to Support session