@catb @regression
Feature: Journal

  @full_smoke
  Scenario: Examiner views candidate details

    Given I am on the journal page as "mobexaminer1"
    When I view candidate details for "Mrs Jane Doe"
