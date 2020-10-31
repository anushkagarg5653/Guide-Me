const Checker = {
  user: {
    email: '',
    weights: {
      "1": 0, // design
      "2": 0, // analyse
      "3": 0  // manage
    }
  },
  questions: [
    {
      "question": "1. What did you study in school?",
      "answers": [
        {
          "text": "Sciences/Engineering",
          "key": "2"
        },
        {
          "text": "Social sciences/Humanities",
          "key": "3"
        },
        {
          "text": "Arts",
          "key": "1"
        }
      ]
    },
    {
      "question": "2. If you had to pick, which ones would you pick?",
      "answers": [
        {
          "text": "Painting",
          "key": "1"
        },
        {
          "text": "Sketching",
          "key": "1"
        },
        {
          "text": "Puzzles",
          "key": "2"
        },
        {
          "text": "Calculations",
          "key": "2"
        },
        {
          "text": "Managing an event",
          "key": "3"
        },
        {
          "text": "Managing a Business",
          "key": "3"
        }
      ]
    },
    {
      "question": "3. Which of the following do you enjoy doing the most?",
      "answers": [
        {
          "text": "Taking Pictures",
          "key": "1"
        },
        {
          "text": "Writing",
          "key": "1"
        },
        {
          "text": "Reading picture novels - comics",
          "key": "1"
        },
        {
          "text": "Reading picture-less novels - books",
          "key": "2"
        },
        {
          "text": "Leading a group through an exercise",
          "key": "3"
        },
        {
          "text": "Watching documentaries",
          "key": "2"
        },
        {
          "text": "Finding out how things work",
          "key": "2"
        },
        {
          "text": "Arranging and organizing things",
          "key": "3"
        },
        {
          "text": "Making plans for future activities",
          "key": "3"
        }
      ]
    },
    {
      "question": "4. Which describes you the most?",
      "answers": [
        {
          "text": "Spending alone time with yourself and taking quiet walks. Basically talking or mingling with a lot of people makes you tired",
          "key": "1"
        },
        {
          "text": "Going clubbing, having parties and mingling with a lot of people. You thrive when you are with a lot of people",
          "key": "2"
        },
        {
          "text": "You like a bit of both; you like being around people and enjoy your time alone",
          "key": "3"
        }
      ]
    },
    {
      "question": "5. When given a task, which of the following do you do first?",
      "answers": [
        {
          "text": "Think through the whole task",
          "key": "2"
        },
        {
          "text": "Think about the first parts and work through it, while you think of the rest",
          "key": "1"
        },
        {
          "text": "Visualize it",
          "key": "1"
        },
        {
          "text": "Break it down into steps",
          "key": "2"
        },
        {
          "text": "Ask more questions about the task",
          "key": "3"
        },
        {
          "text": "Find/get someone to help you do the task",
          "key": "3"
        }
      ]
    },
    {
      "question": "6. If you were to be part of a team working on something, which role would you prefer?",
      "answers": [
        {
          "text": "To be the planner, that is to sketch/draw out or plan it out",
          "key": "1"
        },
        {
          "text": "To be the builder, to find the best ways to join up the parts, and build it",
          "key": "2"
        },
        {
          "text": "To be the guide, check, making sure everything going on is always on track, and not going against goals and making sure goals are in line with current trends etc…",
          "key": "3"
        }
      ]
    },
    {
      "question": "7. Which of the following do you have experience in?",
      "answers": [
        {
          "text": "Managing a project: Planning work to be done and helping monitor the work like a department’s project, community project or the likes",
          "key": "3"
        },
        {
          "text": "Creating flyers and designs on your computer",
          "key": "1"
        },
        {
          "text": "Creating websites or writing programs or coding",
          "key": "2"
        }
      ]
    }
  ],

  showQuestion: (obj, index) => {
    const answers = Checker.buildPossibleAnswers(obj.answers);
    $('#question-form #index').val(index);
    $('#question-form #question').html(obj.question);
    $('#question-form #answers').html(answers);
  },

  buildPossibleAnswers: (ans_arr) => {
    var ansHtml = "<ul>";
    $.each(ans_arr, (index, ans) => {
      ansHtml += "<li>"
      ansHtml += `<input type='checkbox' value='${ans.key}' id='r-${index}'>`
      ansHtml += `<label for='r-${index}'>${ans.text}</label><br>`
      ansHtml += "</li>";
    });
    ansHtml += "</ul>";

    return ansHtml;
  },

  submitQuestion: (responses, index) => {
    // increase the weights for the user response
    responses.each((i, res) => Checker.user.weights[res] = Checker.user.weights[res] + 1);

    // get next question
    const nextIndex = parseInt(index)+1;
    const nextQuestion = Checker.questions[nextIndex];

    if(nextQuestion) {
      // show next question
      Checker.showQuestion(nextQuestion, nextIndex);
    } else {
      // show learning resources for user
      sessionStorage.setItem('userExperience', Checker.getResponseTexts());
      Checker.getRelevantResources();
    }
  },

  getResponseTexts: () => {
    const responses = $('#question-form #answers input:checked').map((i,c) => c.labels[0].innerText);
    return responses.get().join(', ');
  },

  getRelevantResources: () => {
    $.each(Checker.user.weights, (key, score) => sessionStorage.setItem(`skill-${key}`, score));
    window.location.href = 'resources.html'
  }
}

// handle question-form submit
$('form#question-form').submit( (event) => {
  event.preventDefault();
  const index = $('#question-form #index').val();
  // this should be the chossen values.
  const chosenResponses = $('#question-form #answers input:checked').map((i,c) => c.value);

  Checker.submitQuestion(chosenResponses, index);
});

// populate first question
$( document ).ready(() => {
  email = sessionStorage.getItem('userEmail');
  if(email) {
    Checker.user.email = email;
    Checker.showQuestion(Checker.questions[0], 0);
  } else {
    // why don't you identify yourself? are you shy? :wink: :wink:
    window.location.href = '../index.html';
  }
});
