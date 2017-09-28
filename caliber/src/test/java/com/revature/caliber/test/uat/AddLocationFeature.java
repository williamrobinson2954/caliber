package com.revature.caliber.test.uat;

import org.openqa.selenium.WebDriver;

import cucumber.api.java.en.Given;
import cucumber.api.java.en.Then;
import cucumber.api.java.en.When;

public class AddLocationFeature {
	
	private WebDriver webdriver;
	private SettingLocationPage settingLocationPage;
	
	@cucumber.api.java.Before
	public void setup() {
		ChromeDriverSetup setup = ChromeDriverSetup.getInstance();
		settingLocationPage = new SettingLocationPage(setup.getDriver());
	}

	@Given("^I am on the Settings Locations page$")
	public void iAmOnTheSettingsLocationsPage() {
		settingLocationPage.gotoSettingLocationPage();
		settingLocationPage.verifyLocationPage();
	}

	@When("^I click on the Create Location button$")
	public void iClickOnTheCreateLocationButton() throws InterruptedException {
		settingLocationPage.clickCreateLocationBtn();
	}

	@When("^I enter \"([^\"]*)\" as the Company Name$")
	public void iEnterAsTheCompanyName(String companyName) {
		settingLocationPage.inputCompanyName(companyName);
	}

	@When("^I enter \"([^\"]*)\" as the Street Address$")
	public void iEnterAsTheStreetAddress(String address) {
		settingLocationPage.inputStreetAddress(address);
	}

	@When("^I enter \"([^\"]*)\" as the City$")
	public void iEnterAsTheCity(String city) {
		settingLocationPage.inputCity(city);
	}

	@When("^I enter \"([^\"]*)\" as the State$")
	public void iEnterAsTheState(String state) throws InterruptedException {
		settingLocationPage.inputState(state);
	}

	@When("^I enter \"([^\"]*)\" as the Zipcode$")
	public void iEnterAsTheZipcode(String zipcode) {
		settingLocationPage.inputZipcode(zipcode);
	}

	@When("^I click the Save Button$")
	public void iClickTheSaveButton() {
		settingLocationPage.clickSaveButn();
	}

	@Then("^I will have added a location$")
	public void iWillHaveAddedALocation() {
	}
	
	@When("^I choose the X button$")
	public void iChooseTheXButton() {
		settingLocationPage.clickXtoCloseAddLocModalBtn();
	}

	@Then("^I cancel making a new location$")
	public void iCancelMakingANewLocation() {
	}

	@When("^I click on the Close button$")
	public void iClickOnTheCloseButton() {
		settingLocationPage.clickCloseAddLocModalBtn();
	}

	@Then("^I cancel creating a new location$")
	public void iCancelCreatingANewLocation() {
	}
	
}
