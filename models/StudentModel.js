'use strict';
import Student from './schema/Student';
import BaseModel from './BaseModel'

/*
  Model operations to Student
*/
/*
  Because this class extends to BaseModel we inherit from then all the basics data Operations.
  More specifcs data operetions should be implemented here
*/
export default class StudentModel extends BaseModel {
  /*
    getting the data(req.params or req.body stuff) from our controller
  */
  constructor(data) {
    /*
      Calling the constructor from the father class
      and pass to him all the config that him needs to work

      so ... magic, your crud its done :3
      try with another mongooseSchema, will work 
    */
    super(Student, '_id', data)
  }

}