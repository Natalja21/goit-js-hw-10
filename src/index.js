import './css/styles.css';

import { fetchCountries } from './fetchCountries';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const DEBOUNCE_DELAY = 300;

const refs = {
  searchBox: document.querySelector('#search-box'),
  countryList: document.querySelector('.country-list'),
  countryInfo: document.querySelector('.country-info'),
};

refs.searchBox.addEventListener(
  'input',
  debounce(onSearchBoxInput, DEBOUNCE_DELAY)
);

function onSearchBoxInput(e) {
  e.preventDefault();
  const enteredText = e.target.value.trim()
  if (!enteredText) {
    clearInfo()
    return;
  }
  fetchCountries(enteredText)
    .then(countries => searchCountry(countries))
    .catch(error => {
    Notify.failure('Oops, there is no country with that name')
    clearInfo()
    })
}

function searchCountry(countries) {
  clearInfo()
  if (countries.length > 1 && countries.length < 11) {

    creatMarkupCountryList(countries)
  }
  if (countries.length === 1) {

    createMarkupCounrtryInfo(countries)
  }
  if (countries.length > 10) {
    Notify.info("Too many matches found.Please enter a more specific name.")
  }
}

function renderCounrtiesInfo(countries) {
  return countries.map(({ flags: { svg }, name: { official } }) => {
    return `<li class= country-list_item>
      <img src="${svg}" alt= "flag" width="40" height="40"/>
      <p class = country-list_subtitle>${official}</p>
      </li>`;
  })
    .join('');
}

function creatMarkupCountryList(countries) {
  const renderCountries = renderCounrtiesInfo(countries);
  refs.countryList.insertAdjacentHTML('beforeend', renderCountries)
}

function renderCounrtryInfo(countries) {
  const country = countries[0];
  const languages = Object.values(country.languages).join(", ");
  return `<div class= country-list_title><img src="${country.flags.svg}" alt = "flags country" width="4%" height="4%"/>
  <p class = country-info_subtitle>${country.name.official}</p></div>
  <ul class="country-info_list">
  <li><span class="country-info_span">Capital:</span>${country.capital}</li>
  <li><span class="country-info_span">Population:</span>${country.population}</li>
  <li><span class="country-info_span">languages:</span>${languages}</li>
  </ul>
  `
}

function createMarkupCounrtryInfo(countries) {
  const renderCountry = renderCounrtryInfo(countries)
  refs.countryInfo.insertAdjacentHTML('beforeend', renderCountry)
}

function clearInfo() {
  refs.countryList.innerHTML = '';
  refs.countryInfo.innerHTML = '';
}
