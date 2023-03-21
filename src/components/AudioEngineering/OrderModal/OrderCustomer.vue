<template>
  <div class="row pb-2">
    <h2 class="order-heading">
      Please enter your billing information.
    </h2>
    <div class="m-auto">
      <div class="row mb-2">
        <div class="col-lg-12">
          <label class="order-label">Full Name</label>
          <input v-model="customer.name" name="name" type="text" placeholder="Name" class="form-control">
        </div>
      </div>
      <div class="row mb-2">
        <div class="col-lg-6">
          <label class="order-label">Address</label>
          <input v-model="customer.address1" name="address-line1" type="text" placeholder="address line 1" class="form-control">
        </div>
        <div class="col-lg-6 ">
          <label class="order-label">Address 2</label>
          <input v-model="customer.address2" name="address #2" type="text" placeholder="address line 2" class="form-control">
        </div>
      </div>
      <div class="row mb-1">
        <div class="col-lg-6">
          <label class="order-label">City</label>
          <input v-model="customer.city" name="city" type="text" placeholder="city" class="form-control">
        </div>
        <div class="col-lg-6">
          <label class="order-label">State</label>
          <select v-model="customer.state" name="state" class="form-control">
            <option value="" selected="selected">
              (please select your state)
            </option>
            <option :key="index" v-for="(state, index) in states" :value="state.abbreviation" @click="() => updateState(state[index])">
              {{ state.name }}
            </option>
          </select>
        </div>
      </div>
      <div class="row mb-2">
        <div class="col-lg-6">
          <label class="order-label">Zip Code</label>
          <input id="postal-code" v-model="customer.postal" name="postal-code" type="number" maxlength="5" placeholder="zip code" class="form-control">
        </div>
        <div class="col-lg-6">
          <label class="order-label">Country</label>
          <select id="country" v-model="customer.country" name="country" class="form-control">
            <option value="" selected="selected">
              (please select your country)
            </option>
            <option :key="index" v-for="(country, index) in countries" :value="country.code" @click="() => updateCountry(country[index])">
              {{ country.name }}
            </option>
          </select>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  watch: {
    customer: {
      handler (customer) {
        const isDone =
          customer.state &&
          customer.country &&
          customer.postal &&
          customer.city &&
          customer.address1 &&
          customer.name
        if (isDone) {
          this.$emit('updated-customer', customer)
          this.$emit('proceed')
        }
      },
      deep: true
    }
  },
  methods: {
    updateState: function (state) {
      this.customer.state = state.abbreviation
    },
    updateCountry: function (country) {
      this.customer.country = country.code
    }
  },
  data: function () {
    return {
      customer: {
        address1: null,
        address2: null,
        city: null,
        country: null,
        name: null,
        postal: null,
        state: null
      },
      states: [{
        'name': 'Alabama',
        'abbreviation': 'AL'
      },
        {
          'name': 'Alaska',
          'abbreviation': 'AK'
        },
        {
          'name': 'American Samoa',
          'abbreviation': 'AS'
        },
        {
          'name': 'Arizona',
          'abbreviation': 'AZ'
        },
        {
          'name': 'Arkansas',
          'abbreviation': 'AR'
        },
        {
          'name': 'California',
          'abbreviation': 'CA'
        },
        {
          'name': 'Colorado',
          'abbreviation': 'CO'
        },
        {
          'name': 'Connecticut',
          'abbreviation': 'CT'
        },
        {
          'name': 'Delaware',
          'abbreviation': 'DE'
        },
        {
          'name': 'District Of Columbia',
          'abbreviation': 'DC'
        },
        {
          'name': 'Federated States Of Micronesia',
          'abbreviation': 'FM'
        },
        {
          'name': 'Florida',
          'abbreviation': 'FL'
        },
        {
          'name': 'Georgia',
          'abbreviation': 'GA'
        },
        {
          'name': 'Guam',
          'abbreviation': 'GU'
        },
        {
          'name': 'Hawaii',
          'abbreviation': 'HI'
        },
        {
          'name': 'Idaho',
          'abbreviation': 'ID'
        },
        {
          'name': 'Illinois',
          'abbreviation': 'IL'
        },
        {
          'name': 'Indiana',
          'abbreviation': 'IN'
        },
        {
          'name': 'Iowa',
          'abbreviation': 'IA'
        },
        {
          'name': 'Kansas',
          'abbreviation': 'KS'
        },
        {
          'name': 'Kentucky',
          'abbreviation': 'KY'
        },
        {
          'name': 'Louisiana',
          'abbreviation': 'LA'
        },
        {
          'name': 'Maine',
          'abbreviation': 'ME'
        },
        {
          'name': 'Marshall Islands',
          'abbreviation': 'MH'
        },
        {
          'name': 'Maryland',
          'abbreviation': 'MD'
        },
        {
          'name': 'Massachusetts',
          'abbreviation': 'MA'
        },
        {
          'name': 'Michigan',
          'abbreviation': 'MI'
        },
        {
          'name': 'Minnesota',
          'abbreviation': 'MN'
        },
        {
          'name': 'Mississippi',
          'abbreviation': 'MS'
        },
        {
          'name': 'Missouri',
          'abbreviation': 'MO'
        },
        {
          'name': 'Montana',
          'abbreviation': 'MT'
        },
        {
          'name': 'Nebraska',
          'abbreviation': 'NE'
        },
        {
          'name': 'Nevada',
          'abbreviation': 'NV'
        },
        {
          'name': 'New Hampshire',
          'abbreviation': 'NH'
        },
        {
          'name': 'New Jersey',
          'abbreviation': 'NJ'
        },
        {
          'name': 'New Mexico',
          'abbreviation': 'NM'
        },
        {
          'name': 'New York',
          'abbreviation': 'NY'
        },
        {
          'name': 'North Carolina',
          'abbreviation': 'NC'
        },
        {
          'name': 'North Dakota',
          'abbreviation': 'ND'
        },
        {
          'name': 'Northern Mariana Islands',
          'abbreviation': 'MP'
        },
        {
          'name': 'Ohio',
          'abbreviation': 'OH'
        },
        {
          'name': 'Oklahoma',
          'abbreviation': 'OK'
        },
        {
          'name': 'Oregon',
          'abbreviation': 'OR'
        },
        {
          'name': 'Palau',
          'abbreviation': 'PW'
        },
        {
          'name': 'Pennsylvania',
          'abbreviation': 'PA'
        },
        {
          'name': 'Puerto Rico',
          'abbreviation': 'PR'
        },
        {
          'name': 'Rhode Island',
          'abbreviation': 'RI'
        },
        {
          'name': 'South Carolina',
          'abbreviation': 'SC'
        },
        {
          'name': 'South Dakota',
          'abbreviation': 'SD'
        },
        {
          'name': 'Tennessee',
          'abbreviation': 'TN'
        },
        {
          'name': 'Texas',
          'abbreviation': 'TX'
        },
        {
          'name': 'Utah',
          'abbreviation': 'UT'
        },
        {
          'name': 'Vermont',
          'abbreviation': 'VT'
        },
        {
          'name': 'Virgin Islands',
          'abbreviation': 'VI'
        },
        {
          'name': 'Virginia',
          'abbreviation': 'VA'
        },
        {
          'name': 'Washington',
          'abbreviation': 'WA'
        },
        {
          'name': 'West Virginia',
          'abbreviation': 'WV'
        },
        {
          'name': 'Wisconsin',
          'abbreviation': 'WI'
        },
        {
          'name': 'Wyoming',
          'abbreviation': 'WY'
        }
      ],
      countries: [{
        'name': 'Afghanistan',
        'code': 'AF'
      },
        {
          'name': 'Aland Islands\r\nÅland Islands',
          'code': 'AX'
        },
        {
          'name': 'Albania',
          'code': 'AL'
        },
        {
          'name': 'Algeria\r\n',
          'code': 'DZ'
        },
        {
          'name': 'American Samoa\r\n',
          'code': 'AS'
        },
        {
          'name': 'Andorra',
          'code': 'AD'
        },
        {
          'name': 'Angola\r\n',
          'code': 'AO'
        },
        {
          'name': 'Anguilla',
          'code': 'AI'
        },
        {
          'name': 'Antarctica\r\n',
          'code': 'AQ'
        },
        {
          'name': 'Antigua and Barbuda',
          'code': 'AG'
        },
        {
          'name': 'Argentina\r\n',
          'code': 'AR'
        },
        {
          'name': 'Armenia\r\n',
          'code': 'AM'
        },
        {
          'name': 'Aruba\r\n',
          'code': 'AW'
        },
        {
          'name': 'Australia\r\n',
          'code': 'AU'
        },
        {
          'name': 'Austria\r\n',
          'code': 'AT'
        },
        {
          'name': 'Azerbaijan\r\n',
          'code': 'AZ'
        },
        {
          'name': 'Bahamas\r\n',
          'code': 'BS'
        },
        {
          'name': 'Bahrain\r\n',
          'code': 'BH'
        },
        {
          'name': 'Bangladesh\r\n',
          'code': 'BD'
        },
        {
          'name': 'Barbados\r\n',
          'code': 'BB'
        },
        {
          'name': 'Belarus\r\n',
          'code': 'BY'
        },
        {
          'name': 'Belgium\r\n',
          'code': 'BE'
        },
        {
          'name': 'Belize\r\n',
          'code': 'BZ'
        },
        {
          'name': 'Benin\r\n',
          'code': 'BJ'
        },
        {
          'name': 'Bermuda\r\n',
          'code': 'BM'
        },
        {
          'name': 'Bhutan\r\n',
          'code': 'BT'
        },
        {
          'name': 'Bolivia\r\nBolivia, Plurinational state of',
          'code': 'BO'
        },
        {
          'name': 'Bosnia and Herzegovina\r\n',
          'code': 'BA'
        },
        {
          'name': 'Botswana\r\n',
          'code': 'BW'
        },
        {
          'name': 'Bouvet Island\r\n',
          'code': 'BV'
        },
        {
          'name': 'Brazil\r\n',
          'code': 'BR'
        },
        {
          'name': 'British Indian Ocean Territory\r\n',
          'code': 'IO'
        },
        {
          'name': 'Brunei Darussalam\r\n',
          'code': 'BN'
        },
        {
          'name': 'Bulgaria\r\n',
          'code': 'BG'
        },
        {
          'name': 'Burkina Faso\r\n',
          'code': 'BF'
        },
        {
          'name': 'Burundi\r\n',
          'code': 'BI'
        },
        {
          'name': 'Cambodia\r\n',
          'code': 'KH'
        },
        {
          'name': 'Cameroon\r\n',
          'code': 'CM'
        },
        {
          'name': 'Canada\r\n',
          'code': 'CA'
        },
        {
          'name': 'Cape Verde\r\n',
          'code': 'CV'
        },
        {
          'name': 'Cayman Islands\r\n',
          'code': 'KY'
        },
        {
          'name': 'Central African Republic\r\n',
          'code': 'CF'
        },
        {
          'name': 'Chad',
          'code': 'TD'
        },
        {
          'name': 'Chile',
          'code': 'CL'
        },
        {
          'name': 'China\r\n',
          'code': 'CN'
        },
        {
          'name': 'Christmas Island\r\n',
          'code': 'CX'
        },
        {
          'name': 'Cocos (Keeling) Islands\r\n',
          'code': 'CC'
        },
        {
          'name': 'Colombia\r\n',
          'code': 'CO'
        },
        {
          'name': 'Comoros\r\n',
          'code': 'KM'
        },
        {
          'name': 'Congo\r\n',
          'code': 'CG'
        },
        {
          'name': 'Congo, The Democratic Republic of the\r\n',
          'code': 'CD'
        },
        {
          'name': 'Cook Islands\r\n',
          'code': 'CK'
        },
        {
          'name': 'Costa Rica\r\n',
          'code': 'CR'
        },
        {
          'name': 'Côte d\'Ivoire',
          'code': 'CI'
        },
        {
          'name': 'Croatia\r\n',
          'code': 'HR'
        },
        {
          'name': 'Cuba\r\n',
          'code': 'CU'
        },
        {
          'name': 'Cyprus\r\n',
          'code': 'CY'
        },
        {
          'name': 'Czech Republic\r\n',
          'code': 'CZ'
        },
        {
          'name': 'Denmark\r\n',
          'code': 'DK'
        },
        {
          'name': 'Djibouti\r\n',
          'code': 'DJ'
        },
        {
          'name': 'Dominica\r\n',
          'code': 'DM'
        },
        {
          'name': 'Dominican Republic\r\n',
          'code': 'DO'
        },
        {
          'name': 'Ecuador\r\n',
          'code': 'EC'
        },
        {
          'name': 'Egypt\r\n',
          'code': 'EG'
        },
        {
          'name': 'El Salvador\r\n',
          'code': 'SV'
        },
        {
          'name': 'Equatorial Guinea\r\n',
          'code': 'GQ'
        },
        {
          'name': 'Eritrea\r\n',
          'code': 'ER'
        },
        {
          'name': 'Estonia\r\n',
          'code': 'EE'
        },
        {
          'name': 'Ethiopia\r\n',
          'code': 'ET'
        },
        {
          'name': 'Falkland Islands (Malvinas)\r\n',
          'code': 'FK'
        },
        {
          'name': 'Faroe Islands\r\n',
          'code': 'FO'
        },
        {
          'name': 'Fiji\r\n',
          'code': 'FJ'
        },
        {
          'name': 'Finland\r\n',
          'code': 'FI'
        },
        {
          'name': 'France\r\n',
          'code': 'FR'
        },
        {
          'name': 'French Guiana',
          'code': 'GF'
        },
        {
          'name': 'French Polynesia\r\n',
          'code': 'PF'
        },
        {
          'name': 'French Southern Territories',
          'code': 'TF'
        },
        {
          'name': 'Gabon',
          'code': 'GA'
        },
        {
          'name': 'Gambia\r\n',
          'code': 'GM'
        },
        {
          'name': 'Georgia',
          'code': 'GE'
        },
        {
          'name': 'Germany\r\n',
          'code': 'DE'
        },
        {
          'name': 'Ghana\r\n',
          'code': 'GH'
        },
        {
          'name': 'Gibraltar\r\n',
          'code': 'GI'
        },
        {
          'name': 'Greece\r\n',
          'code': 'GR'
        },
        {
          'name': 'Greenland\r\n',
          'code': 'GL'
        },
        {
          'name': 'Grenada',
          'code': 'GD'
        },
        {
          'name': 'Guadeloupe\r\n',
          'code': 'GP'
        },
        {
          'name': 'Guam\r\n',
          'code': 'GU'
        },
        {
          'name': 'Guatemala\r\n',
          'code': 'GT'
        },
        {
          'name': 'Guernsey',
          'code': 'GG'
        },
        {
          'name': 'Guinea\r\n',
          'code': 'GN'
        },
        {
          'name': 'Guinea-Bissau\r\n',
          'code': 'GW'
        },
        {
          'name': 'Guyana\r\n',
          'code': 'GY'
        },
        {
          'name': 'Haiti\r\n',
          'code': 'HT'
        },
        {
          'name': 'Heard Island and McDonald Islands\r\n',
          'code': 'HM'
        },
        {
          'name': 'Holy See (Vatican City State)\r\n',
          'code': 'VA'
        },
        {
          'name': 'Honduras\r\n',
          'code': 'HN'
        },
        {
          'name': 'Hong Kong\r\n',
          'code': 'HK'
        },
        {
          'name': 'Hungary\r\n',
          'code': 'HU'
        },
        {
          'name': 'Iceland\r\n',
          'code': 'IS'
        },
        {
          'name': 'India\r\n',
          'code': 'IN'
        },
        {
          'name': 'Indonesia\r\n',
          'code': 'ID'
        },
        {
          'name': 'Iran, Islamic Republic of\r\n',
          'code': 'IR'
        },
        {
          'name': 'Iraq\r\n',
          'code': 'IQ'
        },
        {
          'name': 'Ireland\r\n',
          'code': 'IE'
        },
        {
          'name': 'Isle of Man\r\n',
          'code': 'IM'
        },
        {
          'name': 'Israel\r\n',
          'code': 'IL'
        },
        {
          'name': 'Italy',
          'code': 'IT'
        },
        {
          'name': 'Jamaica\r\n',
          'code': 'JM'
        },
        {
          'name': 'Japan\r\n',
          'code': 'JP'
        },
        {
          'name': 'Jersey\r\n',
          'code': 'JE'
        },
        {
          'name': 'Jordan\r\n',
          'code': 'JO'
        },
        {
          'name': 'Kazakhstan\r\n',
          'code': 'KZ'
        },
        {
          'name': 'Kenya\r\n',
          'code': 'KE'
        },
        {
          'name': 'Kiribati\r\n',
          'code': 'KI'
        },
        {
          'name': 'Korea, Democratic People&#39;s Republic of\r\n',
          'code': 'KP'
        },
        {
          'name': 'Korea, Republic of\r\n',
          'code': 'KR'
        },
        {
          'name': 'Kuwait\r\n',
          'code': 'KW'
        },
        {
          'name': 'Kyrgyzstan\r\n',
          'code': 'KG'
        },
        {
          'name': 'Lao People&#39;s Democratic Republic\r\n',
          'code': 'LA'
        },
        {
          'name': 'Latvia\r\n',
          'code': 'LV'
        },
        {
          'name': 'Lebanon\r\n',
          'code': 'LB'
        },
        {
          'name': 'Lesotho\r\n',
          'code': 'LS'
        },
        {
          'name': 'Liberia\r\n',
          'code': 'LR'
        },
        {
          'name': 'Libyan Arab Jamahiriya\r\n',
          'code': 'LY'
        },
        {
          'name': 'Liechtenstein\r\n',
          'code': 'LI'
        },
        {
          'name': 'Lithuania\r\n',
          'code': 'LT'
        },
        {
          'name': 'Luxembourg\r\n',
          'code': 'LU'
        },
        {
          'name': 'Macao\r\n',
          'code': 'MO'
        },
        {
          'name': 'Macedonia\r\n',
          'code': 'MK'
        },
        {
          'name': 'Madagascar\r\n',
          'code': 'MG'
        },
        {
          'name': 'Malawi\r\n',
          'code': 'MW'
        },
        {
          'name': 'Malaysia\r\n',
          'code': 'MY'
        },
        {
          'name': 'Maldives\r\n',
          'code': 'MV'
        },
        {
          'name': 'Mali\r\n',
          'code': 'ML'
        },
        {
          'name': 'Malta\r\n',
          'code': 'MT'
        },
        {
          'name': 'Marshall Islands\r\n',
          'code': 'MH'
        },
        {
          'name': 'Martinique\r\n',
          'code': 'MQ'
        },
        {
          'name': 'Mauritania\r\n',
          'code': 'MR'
        },
        {
          'name': 'Mauritius\r\n',
          'code': 'MU'
        },
        {
          'name': 'Mayotte\r\n',
          'code': 'YT'
        },
        {
          'name': 'Mexico\r\n',
          'code': 'MX'
        },
        {
          'name': 'Micronesia, Federated States of\r\n',
          'code': 'FM'
        },
        {
          'name': 'Moldova, Republic of\r\n',
          'code': 'MD'
        },
        {
          'name': 'Monaco\r\n',
          'code': 'MC'
        },
        {
          'name': 'Mongolia\r\n',
          'code': 'MN'
        },
        {
          'name': 'Montenegro\r\n',
          'code': 'ME'
        },
        {
          'name': 'Montserrat\r\n',
          'code': 'MS'
        },
        {
          'name': 'Morocco\r\n',
          'code': 'MA'
        },
        {
          'name': 'Mozambique\r\n',
          'code': 'MZ'
        },
        {
          'name': 'Myanmar\r\n',
          'code': 'MM'
        },
        {
          'name': 'Namibia\r\n',
          'code': 'NA'
        },
        {
          'name': 'Nauru\r\n',
          'code': 'NR'
        },
        {
          'name': 'Nepal\r\n',
          'code': 'NP'
        },
        {
          'name': 'Netherlands\r\n',
          'code': 'NL'
        },
        {
          'name': 'Netherlands Antilles\r\n',
          'code': 'AN'
        },
        {
          'name': 'New Caledonia\r\n',
          'code': 'NC'
        },
        {
          'name': 'New Zealand\r\n',
          'code': 'NZ'
        },
        {
          'name': 'Nicaragua\r\n',
          'code': 'NI'
        },
        {
          'name': 'Niger\r\n',
          'code': 'NE'
        },
        {
          'name': 'Nigeria\r\n',
          'code': 'NG'
        },
        {
          'name': 'Niue\r\n',
          'code': 'NU'
        },
        {
          'name': 'Norfolk Island\r\n',
          'code': 'NF'
        },
        {
          'name': 'Northern Mariana Islands\r\n',
          'code': 'MP'
        },
        {
          'name': 'Norway',
          'code': 'NO'
        },
        {
          'name': 'Oman\r\n',
          'code': 'OM'
        },
        {
          'name': 'Pakistan\r\n',
          'code': 'PK'
        },
        {
          'name': 'Palau\r\n',
          'code': 'PW'
        },
        {
          'name': 'Palestinian Territory, Occupied',
          'code': 'PS'
        },
        {
          'name': 'Panama\r\n',
          'code': 'PA'
        },
        {
          'name': 'Papua New Guinea\r\n',
          'code': 'PG'
        },
        {
          'name': 'Paraguay\r\n',
          'code': 'PY'
        },
        {
          'name': 'Peru\r\n',
          'code': 'PE'
        },
        {
          'name': 'Philippines\r\n',
          'code': 'PH'
        },
        {
          'name': 'Pitcairn\r\n',
          'code': 'PN'
        },
        {
          'name': 'Poland\r\n',
          'code': 'PL'
        },
        {
          'name': 'Portugal\r\n',
          'code': 'PT'
        },
        {
          'name': 'Puerto Rico\r\n',
          'code': 'PR'
        },
        {
          'name': 'Qatar\r\n',
          'code': 'QA'
        },
        {
          'name': 'Réunion',
          'code': 'RE'
        },
        {
          'name': 'Romania\r\n',
          'code': 'RO'
        },
        {
          'name': 'Russian Federation\r\n',
          'code': 'RU'
        },
        {
          'name': 'Rwanda\r\n',
          'code': 'RW'
        },
        {
          'name': 'Saint Barthlemy',
          'code': ''
        },
        {
          'name': 'Saint Helena\r\n',
          'code': 'SH'
        },
        {
          'name': 'Saint Kitts and Nevis\r\n',
          'code': 'KN'
        },
        {
          'name': 'Saint Lucia\r\n',
          'code': 'LC'
        },
        {
          'name': 'Saint Martin',
          'code': 'MF'
        },
        {
          'name': 'Saint Pierre and Miquelon\r\n',
          'code': 'PM'
        },
        {
          'name': 'Saint Vincent and the Grenadines\r\n',
          'code': 'VC'
        },
        {
          'name': 'Samoa\r\n',
          'code': 'WS'
        },
        {
          'name': 'San Marino\r\n',
          'code': 'SM'
        },
        {
          'name': 'Sao Tome and Principe\r\n',
          'code': 'ST'
        },
        {
          'name': 'Saudi Arabia\r\n',
          'code': 'SA'
        },
        {
          'name': 'Senegal\r\n',
          'code': 'SN'
        },
        {
          'name': 'Serbia\r\n',
          'code': 'RS'
        },
        {
          'name': 'Seychelles\r\n',
          'code': 'SC'
        },
        {
          'name': 'Sierra Leone\r\n',
          'code': 'SL'
        },
        {
          'name': 'Singapore\r\n',
          'code': 'SG'
        },
        {
          'name': 'Slovakia\r\n',
          'code': 'SK'
        },
        {
          'name': 'Slovenia\r\n',
          'code': 'SI'
        },
        {
          'name': 'Solomon Islands\r\n',
          'code': 'SB'
        },
        {
          'name': 'Somalia\r\n',
          'code': 'SO'
        },
        {
          'name': 'South Africa\r\n',
          'code': 'ZA'
        },
        {
          'name': 'South Georgia and the South Sandwich Islands\r\n',
          'code': 'GS'
        },
        {
          'name': 'Spain\r\n',
          'code': 'ES'
        },
        {
          'name': 'Sri Lanka\r\n',
          'code': 'LK'
        },
        {
          'name': 'Sudan\r\n',
          'code': 'SD'
        },
        {
          'name': 'Suriname\r\n',
          'code': 'SR'
        },
        {
          'name': 'Svalbard and Jan Mayen\r\n',
          'code': 'SJ'
        },
        {
          'name': 'Swaziland\r\n',
          'code': 'SZ'
        },
        {
          'name': 'Sweden\r\n',
          'code': 'SE'
        },
        {
          'name': 'Switzerland\r\n',
          'code': 'CH'
        },
        {
          'name': 'Syrian Arab Republic\r\n',
          'code': 'SY'
        },
        {
          'name': 'Taiwan\r\n',
          'code': 'TW'
        },
        {
          'name': 'Tajikistan',
          'code': 'TJ'
        },
        {
          'name': 'Tanzania, United Republic of\r\n',
          'code': 'TZ'
        },
        {
          'name': 'Thailand',
          'code': 'TH'
        },
        {
          'name': 'Timor-Leste',
          'code': 'TL'
        },
        {
          'name': 'Togo',
          'code': 'TG'
        },
        {
          'name': 'Tokelau',
          'code': 'TK'
        },
        {
          'name': 'Tonga\r\n',
          'code': 'TO'
        },
        {
          'name': 'Trinidad and Tobago\r\n',
          'code': 'TT'
        },
        {
          'name': 'Tunisia\r\n',
          'code': 'TN'
        },
        {
          'name': 'Turkey',
          'code': 'TR'
        },
        {
          'name': 'Turkmenistan\r\n',
          'code': 'TM'
        },
        {
          'name': 'Turks and Caicos Islands\r\n',
          'code': 'TC'
        },
        {
          'name': 'Tuvalu\r\n',
          'code': 'TV'
        },
        {
          'name': 'Uganda\r\n',
          'code': 'UG'
        },
        {
          'name': 'Ukraine\r\n',
          'code': 'UA'
        },
        {
          'name': 'United Arab Emirates',
          'code': 'AE'
        },
        {
          'name': 'United Kingdom',
          'code': 'GB'
        },
        {
          'name': 'United States\r\n',
          'code': 'US'
        },
        {
          'name': 'United States Minor Outlying Islands\r\n',
          'code': 'UM'
        },
        {
          'name': 'Uruguay\r\n',
          'code': 'UY'
        },
        {
          'name': 'Uzbekistan\r\n',
          'code': 'UZ'
        },
        {
          'name': 'Vanuatu\r\n',
          'code': 'VU'
        },
        {
          'name': 'Venezuela, Bolivarian Republic of',
          'code': 'VE'
        },
        {
          'name': 'Viet Nam',
          'code': 'VN'
        },
        {
          'name': 'Virgin Islands, British\r\n',
          'code': 'VG'
        },
        {
          'name': 'Virgin Islands, U.S.\r\n',
          'code': 'VI'
        },
        {
          'name': 'Wallis and Futuna\r\n',
          'code': 'WF'
        },
        {
          'name': 'Western Sahara\r\n',
          'code': 'EH'
        },
        {
          'name': 'Yemen\r\n',
          'code': 'YE'
        },
        {
          'name': 'Zambia\r\n',
          'code': 'ZM'
        },
        {
          'name': 'Zimbabwe',
          'code': 'ZW'
        }
      ]
    }
  }
}
</script>

<style scoped>
.order-label,
.order-heading,
label {
  font-size: 0.8rem;
  color: #3d2151;
  text-transform: uppercase;
  font-family: 'Montserrat-SemiBold', sans-serif;
  font-weight: 700;
}

.order-heading {
  text-align: center;
  width: 100%;
  font-size: 0.9rem;
  margin-bottom: 30px;
}

.order-radio {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  display: inline-block;
  position: relative;
  background-color: #ede2f0;
  color: #fff;
  top: 10px;
  height: 30px;
  width: 30px;
  border: 0;
  border-radius: 50px;
  cursor: pointer;
  margin-right: 7px;
  outline: none;
}

.order-radio:checked::before {
  position: absolute;
  font: 13px/1 'Open Sans', sans-serif;
  left: 11px;
  top: 7px;
  content: '\02143';
  transform: rotate(40deg);
}

.order-radio:hover,
.order-radio:checked {
  background-color: #dbcfdf;
}
</style>
