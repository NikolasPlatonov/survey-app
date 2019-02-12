import React, {Component} from 'react';
import './App.css';
import {Button} from 'react-bootstrap';
import seedData from '../src/data/seedData.json';
import autoBind from 'react-autobind';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      inputInfo: [],
      radioGroup: {
        eventQuestions: [],
        gender: null,
        accommodationQuestions: [],
        mealsQuestions: [],
        dietaryQuestions: []
      }
    };

    autoBind(this);
  }

  loadDataArrays(surveys) {
    let inputArray = [];
    let count = 0;

    surveys.questions.map(item => {
      if (item.type === 'text') {
        inputArray.push({
          title: item.title,
          subTitle: item.subTitle,
          value: '',
          inputId: count++
        });
      } else if (item.type === 'list') {
        item.questions.map(subItem => {
          if (subItem.type === 'text')
            inputArray.push({
              title: subItem.title,
              value: '',
              inputId: count++
            });
        });
      }
      return inputArray;
    });

    //create new arr with obj. There are new props: "title" == title & answer == new field
    let questionsArray = surveys.questions[2].questions.map((item, index) => ({
      title: item.title,
      answer: null,
      id: index + 300
    }));

    let gender = [
      {
        title: surveys.questions[3].title + surveys.questions[3].subTitle,
        answer: null,
        id: 400
      }
    ];

    let accommodationArray = surveys.questions[4].questions.map((item, index) => ({
      title: item.title,
      answer: null,
      id: index + 500
    }));

    let mealsArray = surveys.questions[5].questions.map((item, index) => ({
      title: item.title,
      answer: null,
      id: index + 600
    }));

    let dietaryType = surveys.questions[6].questions.filter(item => {
      return item.type === 'single_choice';
    });

    let dietaryArray = dietaryType.map((item, index) => ({
      title: item.title,
      answer: null,
      id: index + 700
    }));

    this.setState({
      inputInfo: inputArray,
      radioGroup: {
        eventQuestions: questionsArray,
        gender: gender,
        accommodationQuestions: accommodationArray,
        mealsQuestions: mealsArray,
        dietaryQuestions: dietaryArray
      }
    });
  }

  componentWillMount() {
    this.loadDataArrays(seedData.surveys[0]);
  }

  renderFormTitle() {
    let formTitle = seedData.surveys[0].title;
    let dateSeminar = 'February 2018';
    return (
      <div>
        <div>{formTitle} &ndash;</div>
        <div>{dateSeminar}</div>
      </div>
    );
  }

  renderSubmitBtn() {
    return (
      <div>
        <div>
          <Button className="btn"> Save </Button>
          <Button className="btn btn-primary submit-btn" type="button" value="submit" onClick={this.handleSubmit}>
            Submit
          </Button>
        </div>
      </div>
    );
  }

  handleSubmit() {
    alert('Current data is submitted');
  }

  renderBarInformation() {
    let dateCompleteForm = '4 December 2017';
    return (
      <div>
        <div className="row">
          <div className="col-sm-2 title"> Venue: </div>
          <div className="col-sm-10 information">
            <div>
              The Women's College<br />
              Sydney University<br />
              Camperdown, Sydney<br />
            </div>
          </div>
        </div>
        <div className="row line">
          <div className="row  ">
            <div className="col-sm-12 information">
              <div>
                The information provided in this questionnaire will be used to organise flights, accommodation and meal
                requirements. Please complete and submite this form by <span className="title">{dateCompleteForm}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  renderInput = num => {
    let item = this.state.inputInfo.find(i => {
      if (i.inputId === num) return i;
    });

    return (
      <div>
        <div className="row">
          <div className="col-sm-8">
            <div>
              <span className="title">{item.title}:</span>
              <span> {item.subTitle}</span>
            </div>
            <br />
            <input type="text" itemkey={item.inputId} value={item.value} onChange={this.handleInput} />
          </div>
        </div>
      </div>
    );
  };

  handleInput = e => {
    let num = Number(e.target.getAttribute('itemkey'));

    let currentInput = this.state.inputInfo.map(item => {
      if (item.inputId === num) {
        item.value = e.target.value;
      }
      return item;
    });

    this.setState({
      inputInfo: currentInput
    });
  };

  renderYesNo(title, eventid, answers = ['Yes', 'No']) {
    return (
      <div className="row item">
        <li className="col-sm-7">{title}</li>
        <div className="col-sm-5">
          <input type="radio" value={eventid} name={eventid} answer={answers[0]} onChange={this.handleYesNo} />
          <label className="radio-btn" style={{fontWeight: 100}}>
            {answers[0]}
          </label>
          <input type="radio" value={eventid} name={eventid} answer={answers[1]} onChange={this.handleYesNo} />
          <label className="radio-btn" style={{fontWeight: 100}}>
            {answers[1]}
          </label>
        </div>
      </div>
    );
  }

  handleYesNo = e => {
    let updateRadioGroup = {};
    for (let sectionName in this.state.radioGroup) {
      updateRadioGroup[sectionName] = this.state.radioGroup[sectionName].map(item => {
        if (item.id === Number(e.target.value)) item.answer = e.target.getAttribute('answer');
        return item;
      });
    }

    this.setState({
      radioGroup: updateRadioGroup
    });
  };

  getQuestions(titleFromJson, questionsFromState) {
    return (
      <div>
        <div className="title">{titleFromJson}</div>
        <div className="item">
          {questionsFromState.map(event => <span key={event.id}>{this.renderYesNo(event.title, event.id)}</span>)}
        </div>
      </div>
    );
  }

  getGender(titleFromJson, questionsFromState) {
    return (
      <div>
        <div className="title">{titleFromJson}</div>
        <div className="item">
          {questionsFromState.map(event => (
            <span key={event.id}>{this.renderYesNo(event.title, event.id, ['Male', 'Female'])}</span>
          ))}
        </div>
      </div>
    );
  }

  getDietary(titleFromJson, questionsFromState) {
    return (
      <div>
        <div className="title">{titleFromJson}</div>
        <div className="item">
          {questionsFromState.map(event => (
            <span key={event.id}>{this.renderYesNo(event.title, event.id, ['None', 'Yes'])}</span>
          ))}
        </div>
      </div>
    );
  }

  render() {
    console.log('STATE', this.state);

    let eventsTitle = seedData.surveys[0].questions[2].title;
    let genderTitle = seedData.surveys[0].questions[3].title;
    let accommodationTitle = seedData.surveys[0].questions[4].title;
    let mealsTitle = seedData.surveys[0].questions[5].title;
    let dietaryTitle = seedData.surveys[0].questions[6].title;

    let eventsQuestions = this.state.radioGroup.eventQuestions;
    let gender = this.state.radioGroup.gender;
    let accommodationQuestions = this.state.radioGroup.accommodationQuestions;
    let mealsQuestions = this.state.radioGroup.mealsQuestions;
    let dietaryQuestions = this.state.radioGroup.dietaryQuestions;

    return (
      <form>
        <div className="row">
          <div className="col-sm-3" />
          <div className="col-sm-4 form-title">{this.renderFormTitle()}</div>
          <div className="col-sm-2 up-btn"> {this.renderSubmitBtn()}</div>
          <div className="col-sm-3" />
        </div>
        <div className="row">
          <div className="col-sm-3" />
          <div className="col-sm-6">
            <div>{this.renderBarInformation()}</div>
            <div className="name-title">{this.renderInput(0)}</div>
            <div className="title">{this.renderInput(1)}</div>
            <div>{this.getQuestions(eventsTitle, eventsQuestions)}</div>
            <div>{this.getGender(genderTitle, gender)}</div>
            <div>{this.getQuestions(accommodationTitle, accommodationQuestions)}</div>
            <div>{this.getQuestions(mealsTitle, mealsQuestions)}</div>
            <div>{this.getDietary(dietaryTitle, dietaryQuestions)}</div>
            <div className="for-specify">{this.renderInput(2)}</div>
            <div>{this.renderInput(3)}</div>
            <div className="down-btn">{this.renderSubmitBtn()}</div>
          </div>
          <div className="col-sm-3" />
        </div>
      </form>
    );
  }
}

export default App;
