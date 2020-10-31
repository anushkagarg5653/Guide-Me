const googleApi = {
  apiKey: 'AIzaSyDekIQgs8W6fb7E22VMnaw4ftaI0XSTF1g',

  initClient: () => {
    // 2. Initialize the JavaScript client library.
    gapi.client.init({
      apiKey: googleApi.apiKey,
      discoveryDocs: ["https://sheets.googleapis.com/$discovery/rest?version=v4"],
    })
    .then(() => {
      // 3. Make the API requests.
      const optionsRange = `${Resources.optionKeys[UserDetails.mostRelevant]}!A:C`;
      Resources.fetchRelevant(optionsRange, 'options');
    });
  },
}

const Resources = {
  // these are the names of the different tabs on the Learning Playlist google sheet, as they map to our keys here.
  optionKeys: {
    design: 'Design',
    analyse: 'Analyze',
    manage: 'Manage'
  },
  sheetId: '19nrhUwb0j9A4UPMnHH2VfzlX2tBorj3iVSAHR9YtWdg',

  fetchRelevant: (range, build) => {
    gapi.client.sheets.spreadsheets.values.get({
      spreadsheetId: Resources.sheetId,
      range: range,
    }).then((response) => {
      DomPage.render(response.result.values, build);
    }, (reason) => {
      console.log('Error: ', reason.result.error);
      DomPage.render(['No data found.', '#'], 'options')
    });
  },

  getPlayList: (sheetTab) => {
    Resources.fetchRelevant(`${sheetTab}!A:B`, 'play-list');
  }
}

const DomPage = {
  render: (valuesArr, build)=> {
    resourceList = ""

    if(build === 'options') {
      $.each(valuesArr, (i, arr) => {
        resourceList += DomPage.buildJobOptionListElement(arr);
      });
    }else if(build === 'play-list') {
      $.each(valuesArr, (i, arr) => {
        resourceList += DomPage.buildPlayListElement(arr);
      });
    }

    // append list to the page
    $('#resources').html(resourceList);
  },

  buildPlayListElement: (listArr) => {
    if(listArr[1] === '#') {
      // build a heading
      return `<h3>${listArr[0]}</h3>`
    } else if(listArr[1] === '-') {
      // build a line break
      return `<p>${listArr[0]}</p>`
    } else if(listArr[1] === '~') {
      // build a heading subtitle
      return `<p><i>${listArr[0]}</i></p>`
    } else if(listArr[1] === '*') {
      // build a sub-heading
      return `<p><b>${listArr[0]}</b></p>`
    } else {
      // build a linked paragraph --- url is present(assumption)
      return `<p>${listArr[0]} <a href='${listArr[1]}' target='_blank'>View learning playlist</a></p>`
    }
  },

  buildJobOptionListElement: (listArr) => {
    return `
    <h3>${listArr[0]}</h3>
    <p>${listArr[1]}</p>
    <button onclick='Resources.getPlayList("${listArr[2]}")'>Learn this job</button>
    `
  }
}

const UserDetails = {
  sheetScript: 'https://script.google.com/macros/s/AKfycbxFfDz2nTrhxWVn0GfKoEQwpJN9NEE7GuEXB2me92WxNOd2iAU/exec',
  profileKeys: {
    design: '1',
    analyse: '2',
    manage: '3'
  },
  skillsetWeights: {},

  persist: () => {
    // using app-scripts based on https://developers.google.com/apps-script/guides/web
    const body = UserDetails.buildParams();
    $.ajax({
      type: "POST",
      url: UserDetails.sheetScript,
      data: body,
      contentType: "application/x-www-form-urlencoded"
    });
  },

  buildParams: () => {
    const userEmail = sessionStorage.getItem('userEmail');
    const userExperience = sessionStorage.getItem('userExperience');

    // Keys here should correspond with headers on google sheet.
    return {
      UserEmail: userEmail,
      Experiences: userExperience,
      DesignScore: UserDetails.skillsetWeights['design'],
      AnalyseScore: UserDetails.skillsetWeights['analyse'],
      ManageScore: UserDetails.skillsetWeights['manage'],
      formGoogleSheetName: 'Sheet1', // sheet Tab we are logging to
    }
  }
}

$( document ).ready(function() {
  $.each(UserDetails.profileKeys, (skill, key) => {
    UserDetails.skillsetWeights[skill] = sessionStorage.getItem(`skill-${key}`)
  });
  const weights = UserDetails.skillsetWeights;
  const checked = Object.values(weights).some(w => w > 0);

  if(checked) {
    const hierarchy = Object.keys(weights).sort((a, b) => parseInt(weights[a]) - parseInt(weights[b]));
    // mostRelevant is the last guy in the hierarchy
    const mostRelevant = hierarchy[2]

    UserDetails.mostRelevant = mostRelevant;
    // 1. Load the JavaScript client library.
    gapi.load('client:auth2', googleApi.initClient);
    UserDetails.persist();
  } else {
    window.location.href = 'checker.html';
  }
});
