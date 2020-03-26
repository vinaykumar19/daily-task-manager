import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TaskManagerService {
  public pendingTasks: any[] = [];

  constructor() { }

  public getLocalStorage = () => {
    return JSON.parse(localStorage.getItem('taskData'))

  }

  public setLocalStorage = (data) => {
    let a: any;
    if (localStorage.getItem('taskData') !== null) {
      a = JSON.parse(localStorage.getItem('taskData'));
      a.push(data);
    }
    else {
      a = [];
      a.push(data);
    }
    return localStorage.setItem('taskData', JSON.stringify(a));
  }

  public removeFromLocalStorage = (index, data) => {
    let a: any;
    a = JSON.parse(localStorage.getItem('taskData'));
    a.splice(index, data);

    return localStorage.setItem('taskData', JSON.stringify(a));
  }

  public updateLocalStorage = (data, update) => {
    let a: any;
    a = JSON.parse(localStorage.getItem('taskData'));
    for (let i = 0; i < a.length; i++) {
      if (data.createdAt == a[i].createdAt) {
        a[i].currentStatus = update;

      }
    }

    return localStorage.setItem('taskData', JSON.stringify(a))
  }
}
