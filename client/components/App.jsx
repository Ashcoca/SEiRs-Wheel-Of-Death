import React from 'react';
import update from 'immutability-helper';

import StudentCard from './StudentCard.jsx';
import AllStudents from './AllStudents.jsx';

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      students: [],
      picked: null,
      view: 'home',
      isLoading: true,
      error: null,
    };
    this.pickRandomStudent = this.pickRandomStudent.bind(this);
    this.leastPickedStudent = this.leastPickedStudent.bind(this);
    this.toggleView = this.toggleView.bind(this);
    this.toggleAll = this.toggleAll.bind(this);
  };

  componentDidMount() {
    //fetch from (DB) list of students, sort data, then add to state
    fetch('/students')
    .then(response => response.json())
    .then(data => {
      data.sort(function (a, b) {
        return a.timesCalled - b.timesCalled;
      });
      this.setState({
        students: data,
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
    // Set picked to the random Index, and update the # of timesCalled
    this.setState({
      picked: this.state.students[index],
      students: update(this.state.students, {[index]: {timesCalled: {$set: this.state.students[index].timesCalled ++}}}),
      view: 'card'
    });
  }

  leastPickedStudent() {
    // Fetch request, returns single student and update entry in DB?
    // Placeholder function for dev purposes, not the most robust but it's all gonna be scrapped anyways

    // Since data has been sorted in fetch request, index 0 should be a student with the fewest timesCalled
    this.setState({
      picked: this.state.students[0],
      students: update(this.state.students, {[0]: {timesCalled: {$set: this.state.students[0].timesCalled ++}}}),
      view: 'card'
    })
  }

  toggleView() {
    this.setState({ view: 'home' })
  }

  toggleAll() {
    this.setState({ view: 'all' })
  }

  render() {
    if (this.state.isLoading) {
       return ( <div> <img src='https://thumbs.gfycat.com/FaithfulDeafeningBullmastiff-small.gif'></img> </div> ) 
    }
    if (this.state.view === 'home') {
      return (
        <div>
          <button onClick={this.pickRandomStudent}>Test Random Student</button>
          <button onClick={this.leastPickedStudent}>Test Least Picked Student</button>
          <button onClick={this.toggleAll}>Test See All Students</button>
        </div>
      );
    }
    if (this.state.view === 'card') { 
      return ( <StudentCard onClose={this.toggleView} data={this.state.picked}/> ) 
    }
    if (this.state.view === 'all') {
      return ( <AllStudents onClose={this.toggleView} items={this.state.students}/>)
    }
  }
}

export default App;