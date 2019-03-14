import React from 'react';

import StudentCard from './StudentCard.jsx';
import AllStudents from './AllStudents.jsx';
import Spinner from './Spinner.jsx';
import Navigation from './Navigation.jsx';
import replacementPic from '../data.jsx';

// Notes
// Want to add React Router to try it out and to replace view state to declutter state
// Tentative routes (will reassess if it conflicts with server routes)
// Home -> /
// Card -> /student/:id
// All -> /students

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      students: [],
      picked: null,
      view: 'home',
      isLoading: true,
      error: null,
    };
    this.pickRandomStudent = this.pickRandomStudent.bind(this);
    this.leastPickedStudent = this.leastPickedStudent.bind(this);
    this.viewHome = this.viewHome.bind(this);
    this.viewAll = this.viewAll.bind(this);
    this.uploadFile = this.uploadFile.bind(this);
    this.updateStudentData = this.updateStudentData.bind(this);
  }

  componentDidMount() {
    // fetch from (DB) list of students, sort data, then add to state
    fetch('/students')
      .then(response => response.json())
      .then((data) => {
        data.forEach((student) => {
          student.name = (`${student.name[0]} ${student.name[1]}`);
          if (!student["profilePic"]) {
            student["profilePic"] = replacementPic();
          }
        });
        this.setState({
          students: data,
          isLoading: false,
        });
      })
      .catch(error => this.setState({ error, isLoading: false }));
  }

  pickRandomStudent() {
    // Figure we can give John the option of just picking a random student along with picking the least called on students
    // Using this picRandomStudent could trigger the Wheel of Death animation maybe?
    const max = this.state.students.length;
    const index = Math.floor(Math.random() * (max - 1) + 1);
    this.setState({
      picked: this.state.students[index],
      view: 'card',
    });
  }

  leastPickedStudent() {
    // Fetch request, returns single student and update entry in DB?
    const uncalled = this.state.students.find((student) => {
      return student.timesCalled <= 1;
    });
    this.setState({
      picked: uncalled,
      view: 'card',
    });
  }

  // viewHome resets everything
  viewHome() {
    this.setState({ 
      view: 'home',
      picked: null,
      studentsToShow: 0,
      filteredStudents: this.state.students,
    });
  }

  // Renders AllStudents component
  viewAll() {
    this.setState({ view: 'all' });
  }

  // eslint-disable-next-line class-methods-use-this
  uploadFile(files) {
    const reader = new FileReader();
    reader.onload = (e) => {
      // Use reader.result
      alert(reader.result) //eslint-disable-line
    };
    reader.readAsText(files[0]);
  }

  // Super hacky, will need to be overhauled later once the DB is set up.
  // But we are currently allowing for adding notes to the end of cards.
  updateStudentData(event) {
    let id;
    (event.target.id) ? id = event.target.id : id = event.target.parentNode.id || event.target.childNode.id
    const oldState = this.state.students;
    const oldStudentData = this.state.students.find((student) => { return student.id == id;
    });
    const newData = prompt(`Enter notes for student, ${oldStudentData.name}`);
    if (newData !== null) {
      oldStudentData.notes.push(`${(oldStudentData.notes.length - 1) + 1}. ${newData} \r\n`);
      oldState.forEach((student) => { if (student.id == id) { student = oldStudentData; } });
      this.setState({
        students: oldState,
      });
    }
  }

  render() {
    if (this.state.isLoading) {
      return (<Spinner />);
    }
    if (this.state.view === 'home') {
      return (<Navigation pickRandom={this.pickRandomStudent} pickLeast={this.leastPickedStudent} viewAll={this.viewAll} handleFiles={this.uploadFile}/>);
    }
    if (this.state.view === 'card') {
      return (
      <div>
        <i className={['fas fa-home', 'btn-back'].join(' ')} onClick={this.viewHome} title="Home"></i>
        <StudentCard data={this.state.picked} addNotes={this.updateStudentData}/>
      </div>
      );
    }
    if (this.state.view === 'all') {
      return (<AllStudents onClose={this.viewHome} items={this.state.students} addNotes={this.updateStudentData}/>);
    }
  }
}

export default App;
