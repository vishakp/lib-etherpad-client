import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { CookieService } from 'ngx-cookie-service'

@Injectable({
  providedIn: 'root'
})
export class EtherpadClientService {

  apiRoot = ''
  apiKey = ''
  constructor(
    private http: HttpClient,
    private cookie: CookieService
  ) {
    
  }

  connect(settings:any){
    this.apiRoot = settings.host + ':' + settings.port + '/'
    this.apiKey = settings.apikey
  }

  getDocSession(username, userId, meetingId, meetingName) {
    return new Promise((resolve, reject) => {
      this.createAuthorIfNotExistsFor(username, userId)
        .then((auther: any) => {

          console.log("auither", auther)
          let autherId = auther.data.authorID
          this.createGroupIfNotExistsFor(meetingId)
            .then((group: any) => {


              let groupId = group.data.groupID
              this.listPads(groupId)
                .then((pads: any) => {
                  if (pads.data.padIDs.length == 0) {
                    this.createGroupPad(groupId, meetingName)
                      .then((pad: any) => {
                        this.createSession(groupId, autherId)
                          .then((session: any) => {
                            let date = new Date()
                            let exp = date.setHours(date.getHours() + 24)
                            this.cookie.set('sessionID', session.data.sessionID, exp, '/')
                            resolve({
                              padId: pad.data.padID,
                              sessionID: session.data.sessionID
                            })
                          })

                      })
                  } else {
                    this.createSession(groupId, autherId)
                      .then((session: any) => {
                        resolve({
                          padId: pads.data.padIDs[0],
                          sessionID: session.data.sessionID
                        })
                      })

                  }

                })
            })
        })
    })
  }

  /*
   * Auther methods
   */

  createAuther(name) {
    return new Promise((resolve, reject) => {
      this.http.get(this.apiRoot + 'api/1/createAuthor?apikey=' + this.apiKey + '&name=' + name)
        .subscribe((res: any) => {
          if (res.code == 0)
            resolve(res)
          else
            reject(res)
        })

    })
  }

  createAuthorIfNotExistsFor(name, userId) {
    return new Promise((resolve, reject) => {
      this.http.get(this.apiRoot + 'api/1/createAuthorIfNotExistsFor?apikey=' + this.apiKey + '&name=' + name + '&authorMapper=' + userId)
        .subscribe((res: any) => {
          if (res.code == 0)
            resolve(res)
          else
            reject(res)
        })

    })
  }

  listPadsOfAuthor(authorID) {
    return new Promise((resolve, reject) => {
      this.http.get(this.apiRoot + 'api/1/listPadsOfAuthor?apikey=' + this.apiKey + '&authorID=' + authorID)
        .subscribe((res: any) => {
          if (res.code == 0)
            resolve(res)
          else
            reject(res)
        })

    })
  }

  getAuthorName(authorID) {
    return new Promise((resolve, reject) => {
      this.http.get(this.apiRoot + 'api/1.1/getAuthorName?apikey=' + this.apiKey + '&authorID=' + authorID)
        .subscribe((res: any) => {
          if (res.code == 0)
            resolve(res)
          else
            reject(res)
        })

    })
  }


  /*
   * Group methods
   */

  createGroup(meetingId) {
    return new Promise((resolve, reject) => {
      this.http.get(this.apiRoot + 'api/1/createGroup?apikey=' + this.apiKey)
        .subscribe((res: any) => {
          if (res.code == 0)
            resolve(res)
          else
            reject(res)
        })
    })
  }

  createGroupIfNotExistsFor(meetingId) {
    return new Promise((resolve, reject) => {
      this.http.get(this.apiRoot + 'api/1/createGroup?apikey=' + this.apiKey)
        .subscribe((res: any) => {
          if (res.code == 0)
            resolve(res)
          else
            reject(res)
        })
    })
  }

  deleteGroup(groupID) {
    return new Promise((resolve, reject) => {
      this.http.get(this.apiRoot + 'api/1/createGroup?apikey=' + this.apiKey + '&groupID=' + groupID)
        .subscribe((res: any) => {
          if (res.code == 0)
            resolve(res)
          else
            reject(res)
        })
    })
  }

  listPads(groupID) {
    return new Promise((resolve, reject) => {
      this.http.get(this.apiRoot + 'api/1/listPads?apikey=' + this.apiKey + '&groupID=' + groupID)
        .subscribe((res: any) => {
          if (res.code == 0)
            resolve(res)
          else
            reject(res)
        })
    })
  }

  createGroupPad(groupID, padName, padText = '') {
    return new Promise((resolve, reject) => {
      this.http.get(this.apiRoot + 'api/1/createGroupPad?apikey=' + this.apiKey + '&groupID=' + groupID + '&padName=' + padName + '&text=' + padText)
        .subscribe((res: any) => {
          if (res.code == 0)
            resolve(res)
          else
            reject(res)
        })
    })
  }

  listAllGroups() {
    return new Promise((resolve, reject) => {
      this.http.get(this.apiRoot + 'api/1.1/listPads?apikey=' + this.apiKey)
        .subscribe((res: any) => {
          if (res.code == 0)
            resolve(res)
          else
            reject(res)
        })
    })
  }



  /*
   * Session methods
   */

  createSession(groupID, authorID) {
    let currentDate = new Date()
    currentDate.setHours(currentDate.getHours() + 24)
    let validUntil = currentDate.getTime() / 1000
    return new Promise((resolve, reject) => {
      this.http.get(this.apiRoot + 'api/1/api/1/createSession?apikey=' + this.apiKey + '&groupID=' + groupID + '&authorID=' + authorID + '&validUntil=' + validUntil)
        .subscribe((res: any) => {
          if (res.code == 0) {
            let date = new Date()
            let exp = date.setHours(date.getHours() + 24)
            this.cookie.set('sessionID', res.data.sessionID, exp, '/')
            resolve(res)
          }
          else
            reject(res)
        })
    })
  }

  deleteSession(sessionId) {
    return new Promise((resolve, reject) => {
      this.http.get(this.apiRoot + 'api/1/deleteSession?apikey=' + this.apiKey + '&sessionID=' + sessionId)
        .subscribe((res: any) => {
          if (res.code == 0)
            resolve(res)
          else
            reject(res)
        })
    })
  }

  getSessionInfo(sessionId) {
    return new Promise((resolve, reject) => {
      this.http.get(this.apiRoot + 'api/1/api/1/getSessionInfo?apikey=' + this.apiKey + '&sessionID=' + sessionId)
        .subscribe((res: any) => {
          if (res.code == 0)
            resolve(res)
          else
            reject(res)
        })
    })
  }

  listSessionsOfGroup(groupID) {
    return new Promise((resolve, reject) => {
      this.http.get(this.apiRoot + 'api/1/listSessionsOfGroup?apikey=' + this.apiKey + '&groupID=' + groupID)
        .subscribe((res: any) => {
          if (res.code == 0)
            resolve(res)
          else
            reject(res)
        })
    })
  }

  listSessionsOfAuthor(authorID) {
    return new Promise((resolve, reject) => {
      this.http.get(this.apiRoot + 'api/1/listSessionsOfAuthor?apikey=' + this.apiKey + '&authorID=' + authorID)
        .subscribe((res: any) => {
          if (res.code == 0)
            resolve(res)
          else
            reject(res)
        })
    })
  }



  /*
   * Pad methods
   */

  createPad(padId, text = '') {
    return new Promise((resolve, reject) => {
      this.http.get(this.apiRoot + 'api/1/createPad?apikey=' + this.apiKey + '&padID=' + padId + '&text=' + text)
        .subscribe((res: any) => {
          if (res.code == 0)
            resolve(res)
          else
            reject(res)
        })
    })
  }

  getRevisionsCount(padId) {
    return new Promise((resolve, reject) => {
      this.http.get(this.apiRoot + 'api/1/getRevisionsCount?apikey=' + this.apiKey + '&padID=' + padId)
        .subscribe((res: any) => {
          if (res.code == 0)
            resolve(res)
          else
            reject(res)
        })
    })
  }

  getSavedRevisionsCount(padId) {
    return new Promise((resolve, reject) => {
      this.http.get(this.apiRoot + 'api/1.2.11/getSavedRevisionsCount?apikey=' + this.apiKey + '&padID=' + padId)
        .subscribe((res: any) => {
          if (res.code == 0)
            resolve(res)
          else
            reject(res)
        })
    })
  }

  listSavedRevisions(padId) {
    return new Promise((resolve, reject) => {
      this.http.get(this.apiRoot + 'api/1.2.11/listSavedRevisions?apikey=' + this.apiKey + '&padID=' + padId)
        .subscribe((res: any) => {
          if (res.code == 0)
            resolve(res)
          else
            reject(res)
        })
    })
  }

  saveRevision(padId, rev) {
    return new Promise((resolve, reject) => {
      this.http.get(this.apiRoot + 'api/1.2.11/saveRevision?apikey=' + this.apiKey + '&padID=' + padId + '&rev=' + rev)
        .subscribe((res: any) => {
          if (res.code == 0)
            resolve(res)
          else
            reject(res)
        })
    })
  }

  padUsersCount(padId) {
    return new Promise((resolve, reject) => {
      this.http.get(this.apiRoot + 'api/1/padUsersCount?apikey=' + this.apiKey + '&padID=' + padId)
        .subscribe((res: any) => {
          if (res.code == 0)
            resolve(res)
          else
            reject(res)
        })
    })
  }

  padUsers(padId) {
    return new Promise((resolve, reject) => {
      this.http.get(this.apiRoot + 'api/1.1/padUsers?apikey=' + this.apiKey + '&padID=' + padId)
        .subscribe((res: any) => {
          if (res.code == 0)
            resolve(res)
          else
            reject(res)
        })
    })
  }

  deletePad(padId) {
    return new Promise((resolve, reject) => {
      this.http.get(this.apiRoot + 'api/1/padUsers?apikey=' + this.apiKey + '&padID=' + padId)
        .subscribe((res: any) => {
          if (res.code == 0)
            resolve(res)
          else
            reject(res)
        })
    })
  }

  listAllPads() {
    return new Promise((resolve, reject) => {
      this.http.get(this.apiRoot + 'api/1.2.1/listAllPads?apikey=' + this.apiKey)
        .subscribe((res: any) => {
          if (res.code == 0)
            resolve(res)
          else
            reject(res)
        })
    })
  }

  getReadOnlyID(padId) {
    return new Promise((resolve, reject) => {
      this.http.get(this.apiRoot + 'api/1/getReadOnlyID?apikey=' + this.apiKey + '&padID=' + padId)
        .subscribe((res: any) => {
          if (res.code == 0)
            resolve(res)
          else
            reject(res)
        })
    })
  }

}
