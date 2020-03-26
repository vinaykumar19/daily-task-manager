import { Component, OnInit } from '@angular/core';
import { TaskManagerService } from '../task-manager.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Location } from '@angular/common';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  public taskTitle: any;
  public description: any;
  public priority: any;
  public possibleProrities = ['High', 'Normal', 'Low']
  public selectedDate: any;
  public status: any = "Pending";
  public totalTasks: any;
  public pendingTasks: any;
  public sortedPendingTasks: any = [];
  public inProcessTasks: any = [];
  public completedTasks: any = [];
  public completedPercentage: any;
  public flowFromEditData: any = null;
  public red: any;
  public amber: any;
  public green: any;


  constructor(private taskManagerService: TaskManagerService, public router: Router, public toastr: ToastrService, private location: Location) { }

  ngOnInit() {
    this.getTotalTasks()

  }

  getTotalTasks = () => {
    this.pendingTasks = [];
    this.inProcessTasks = [];
    this.completedTasks = [];
    this.totalTasks = this.taskManagerService.getLocalStorage();
    if (this.totalTasks != null) {
      for (let i = 0; i < this.totalTasks.length; i++) {
        if (this.totalTasks[i].currentStatus == "Pending") {
          this.pendingTasks.push(this.totalTasks[i])
        }
        else if (this.totalTasks[i].currentStatus == "InProcess") {
          this.inProcessTasks.push(this.totalTasks[i])
        }
        else if (this.totalTasks[i].currentStatus == "Completed") {
          this.completedTasks.push(this.totalTasks[i])

        }
        else {

        }
      }

      this.sortedPendingTasks = this.pendingTasks.sort((a, b) => Date.parse(b.completionDate) - Date.parse(a.completionDate))
    }
    else { }
    if (this.totalTasks != null) {
      this.completedPercentage = ((this.completedTasks.length / this.totalTasks.length) * 100).toFixed(2);
      if (this.completedPercentage <= 33) {
        this.green = '';
        this.amber = '';
        this.red = this.completedPercentage;
      }
      else if (this.completedPercentage > 33 && this.completedPercentage < 66) {
        this.red = '';
        this.green = ''
        this.amber = this.completedPercentage;
      }
      else {
        this.amber = '';
        this.red = '';
        this.green = this.completedPercentage;
      }
    }

  }

  submit = () => {

    let pendingData: any = {
      "title": this.taskTitle,
      "description": this.description,
      "priority": this.priority,
      "completionDate": this.selectedDate,
      "currentStatus": this.status,
      "createdAt": new Date(Date.now())
    }
    this.taskManagerService.setLocalStorage(pendingData);

    setTimeout(() => {
      this.getTotalTasks();
      
     
    }, 500)
    if (this.flowFromEditData !== null) {
      this.toastr.success("Task edited Successfully")
      this.deleteData(this.flowFromEditData)
      this.flowFromEditData = null;
    }
    else {
      this.toastr.success("Task Created Successfully")
    }

  }

  onCloseModal = () => {
    this.flowFromEditData = null;
    this.taskTitle = null;
    this.description = null;
    this.priority = null;
    this.selectedDate = null;
   
  }

  editData = (data) => {
    this.taskTitle = data.title;
    this.description = data.description;
    this.priority = data.priority;
    this.selectedDate = new Date(data.completionDate);
    this.flowFromEditData = data;

  }
  deleteData = (data) => {
    let x = this.taskManagerService.getLocalStorage();
    let index;
    for (let i = 0; i < x.length; i++) {
      if (x[i].createdAt == data.createdAt) {
        index = i;
        break;
      }
    }
    if (index != undefined) {

      this.taskManagerService.removeFromLocalStorage(index, 1)
      setTimeout(() => {
        this.getTotalTasks()

      }, 500);


    }
    else {
    }

  }

  onDrop(event: CdkDragDrop<any[]>) {
    if (event.container !== event.previousContainer) {
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);

      let i = event.container.data.length

      if (event.container.data[i - 1].currentStatus == 'Pending') {
        this.taskManagerService.updateLocalStorage(event.container.data[i - 1], 'InProcess')
        this.getTotalTasks();
      }

      else {
        this.taskManagerService.updateLocalStorage(event.container.data[i - 1], 'Completed')
        this.getTotalTasks();


      }
    }

  }

}
