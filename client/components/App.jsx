import React from 'react';
import { animateScroll as scroll } from 'react-scroll'

import StudentCard from './StudentCard.jsx';
import AllStudents from './AllStudents.jsx';
import Spinner from './Spinner.jsx';

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      students: [],
      picked: null,
      studentsToShow: 0,
      filteredStudents: [],
      view: 'home',
      isLoading: true,
      error: null,
    };
    this.pickRandomStudent = this.pickRandomStudent.bind(this);
    this.leastPickedStudent = this.leastPickedStudent.bind(this);
    this.viewHome = this.viewHome.bind(this);
    this.viewAll = this.viewAll.bind(this);
    this.nextTenStudents = this.nextTenStudents.bind(this);
    this.searchStudents = this.searchStudents.bind(this);
    this.scrollToTop = this.scrollToTop.bind(this);
  };

  componentDidMount() {
    //fetch from (DB) list of students, sort data, then add to state
    fetch('/students')
    .then(response => response.json())
    .then(data => {
      data.sort((a, b) => {
        return a.timesCalled - b.timesCalled;
      })
      data.forEach((student) => {
        return student.name = student.name[0] + " " + student.name[1];
      })
      this.setState({
        students: data,
        filteredStudents: data,
        isLoading: false
      })
    })
    .catch(error => this.setState({ error, isLoading: false })
    );

  }

  pickRandomStudent() {
    // Figure we can give John the option of just picking a random student along with picking the least called on students
    // Using this picRandomStudent could trigger the Wheel of Death animation maybe?
    const max = this.state.students.length;
    const index = Math.floor(Math.random() * (max - 1) + 1);
    // Set picked to the random Index, and update the # of 
    this.setState({
      picked: this.state.students[index],
      view: 'card'
    });
  }

  leastPickedStudent() {
    // Fetch request, returns single student and update entry in DB?
    // Placeholder function for dev purposes, not the most robust but it's all gonna be scrapped anyways

    // Since data has been sorted in fetch request, index 0 should be a student with the fewest timesCalled
    this.setState({
      picked: this.state.students[0],
      view: 'card'
    })
  }

  // Load up the next 10 students when viewing All Students -- may consider adding prevTenStudents functionality
  nextTenStudents() {
    if (this.state.studentsToShow > this.state.students.length) {
      // I am open to better options than this alert box lol
      alert('Stop clicking, there are no more students!');
    } else {
    this.setState({ studentsToShow: this.state.studentsToShow + 10 });
    this.scrollToTop();
    }
  }

  scrollToTop() {
    scroll.scrollToTop({duration: 500});
  }

  // viewHome resets everything
  viewHome() {
    this.setState({ 
      view: 'home',
      picked: null,
      studentsToShow: 0,
      filteredStudents: this.state.students
    });
  }

  // Renders AllStudents component
  viewAll() {
    this.setState({ view: 'all' });
  }

  searchStudents(event) {
    let query = event.target.value;
    let searchResults = this.state.students.filter(studentObj => {
      return studentObj.name.toLowerCase().includes(query.toLowerCase())
    })
    this.setState({
      filteredStudents: searchResults
    });
  }

  // Could move the buttons into their own component for more modularity?
  // Replace or CSS buttons to make this part of the app more visually pleasing
  render() {
    if (this.state.isLoading) {
      return ( <Spinner /> ) 
    }
    if (this.state.view === 'home') {
      return (
        <div>
          <button className="btn-random" onClick={this.pickRandomStudent}>Test Random Student</button>
          <button className="btn-least" onClick={this.leastPickedStudent}>Test Least Picked Student</button>
          <button className="btn-all" onClick={this.viewAll}>Test See All Students</button>
        </div>
      );
    }
    if (this.state.view === 'card') { 
      return ( <StudentCard onClose={this.viewHome} data={this.state.picked}/> ) 
    }
    if (this.state.view === 'all') {
      return ( <AllStudents onClose={this.viewHome} search={this.searchStudents} next={this.nextTenStudents} items={this.state.filteredStudents.slice(this.state.studentsToShow, this.state.studentsToShow+10)}/> )
    }
  }
};

export default App;



/*
Notes: http://wheelnavjs.softwaretailoring.net/index.html

*/