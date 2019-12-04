import $ from 'jquery';
window.jQuery = $;
window.$ = $;

import 'bootstrap';
import './players';
import './regex';
import './styles/main.scss';

import '@fortawesome/fontawesome-free/js/fontawesome';
import '@fortawesome/fontawesome-free/js/solid';
import '@fortawesome/fontawesome-free/js/regular';
import '@fortawesome/fontawesome-free/js/brands';

import { localhost } from './messages';
console.log(localhost());
