import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import { environment } from '../../environments/environment';
import { signupForm } from '../data-model/data-model'
import { loginForm } from '../data-model/data-model'
const API_URL = environment.API_URL;
@Injectable()
export class NativeService {
    public token: string;
    public role: string;
    public firstName: string;
    public lastName: string;
    public headers: Headers;
    public options: RequestOptions;

    constructor(private http: Http, private router: Router) {

    }


    login(email: string, password: string): Observable<boolean> {
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let requestOption = new RequestOptions({ headers: headers });
        return this.http.post(API_URL+'/login', JSON.stringify({ email: email, password: password }), requestOption)
            .map((response: Response) => {
                if (response.json().code === 200) {
                    // login successful if there's a jwt token in the response
                    let token = response.json() && response.json().data.token;
                    let role = response.json() && response.json().data.role;
                    let firstName = response.json() && response.json().data.firstName;
                    let lastName = response.json() && response.json().data.lastName;
                    if (token) {
                        // set token property
                        this.token = token;
                        this.firstName = firstName;
                        this.lastName = lastName;
                        // store username and jwt token in local storage to keep user logged in between page refreshes
                        localStorage.setItem('currentUser', JSON.stringify({ firstName: firstName, lastName: lastName, email: email, token: token }));
                    }
                }
                return response.json();
            })
            .catch(this.handleError);
    }

    logout(): void {
        // clear token remove user from local storage to log user out
        this.token = null;
        localStorage.removeItem('currentUser');
    }

    signup(new_user): Observable<Response> {
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let requestOption = new RequestOptions({ headers: headers });
        return this.http.post(API_URL+'/signup', new_user, requestOption)
            .map(this.extractData)
            .do(data => console.log('added new user ' + JSON.stringify(data)))
            .catch(this.handleError);
    }

    // addLinkedInUser(new_prod):Observable<Response>{
    //     return this.http.post(API_URL+'/addUserLinkedInData',new_prod)
    //                   .map(this.extractData)
    //                   .do(data => console.log('added new linkedin user'+JSON.stringify(data)))
    //                   .catch(this.handleError);
    //   }

    searchByCategory(searchQueries): Observable<Response> {
        return this.http.post(API_URL+'/api/getSearchResults', searchQueries, this.jwt())
            .map(this.extractData)
            .do(data => console.log('search result' + JSON.stringify(data)))
            .catch(this.handleError);
    }

    addCategory(category): Observable<Response> {
        return this.http.post(API_URL+'/api/addNewCategory', category, this.jwt())
            .map(this.extractData)
            .do(data => console.log('search result' + JSON.stringify(data)))
            .catch(this.handleError);
    }

    addPost(post): Observable<Response> {
        let currentUser = JSON.parse(localStorage.getItem('currentUser'));
        let headers = new Headers();
        headers.append('Authorization', 'Bearer ' + currentUser.token);
        headers.delete('Content-Type');
        let reqOption = new RequestOptions({ headers: headers });
        return this.http.post(API_URL+'/api/publishPost', post, reqOption)
            .map(this.extractData)
            .do(data => console.log('search result' + JSON.stringify(data)))
            .catch(this.handleError);
    }

    addBlog(post): Observable<Response> {
        let currentUser = JSON.parse(localStorage.getItem('currentUser'));
        let headers = new Headers();
        headers.append('Authorization', 'Bearer ' + currentUser.token);
        headers.delete('Content-Type');
        let reqOption = new RequestOptions({ headers: headers });
        return this.http.post(API_URL+'/api/publishBlog', post, reqOption)
            .map(this.extractData)
            .do(data => console.log('search result' + JSON.stringify(data)))
            .catch(this.handleError);
    }

    createPassword(userData): Observable<Response> {
        return this.http.post(API_URL+'/createPassword', userData)
            .map(this.extractData)
            .do(data => console.log('updated password' + JSON.stringify(data)))
            .catch(this.handleError);
    }

    checkUserStatus(userEmail): Observable<Response> {
        return this.http.post(API_URL+'/checkUserPresent', userEmail)
            .map(this.extractData)
            .do(data => console.log('user status ' + JSON.stringify(data)))
            .catch(this.handleError);
    }

    forgotPass(userInfo): Observable<Response> {
        return this.http.post(API_URL+'/createPassword', userInfo)
            .map(this.extractData)
            .do(data => console.log('user status ' + JSON.stringify(data)))
            .catch(this.handleError);
    }

    followCio(cioData): Observable<Response> {
        return this.http.post(API_URL+'/api/followCio', cioData, this.jwt())
            .map(this.extractData)
            .do(data => console.log('just follow cio' + JSON.stringify(data)))
            .catch(this.handleError);
    }
    
    addFriend(cioData): Observable<Response> {
        return this.http.post(API_URL+'/api/sendFriendRequest', cioData, this.jwt())
            .map(this.extractData)
            .do(data => console.log('just become friend with cio' + JSON.stringify(data)))
            .catch(this.handleError);
    }
    
    deleteCio(cioData): Observable<Response> {
        return this.http.post(API_URL+'/api/deleteAccount', cioData, this.jwt())
            .map(this.extractData)
            .do(data => console.log('just deleted cio' + JSON.stringify(data)))
            .catch(this.handleError);
    }

    updateProfile(userData): Observable<Response> {
        let currentUser = JSON.parse(localStorage.getItem('currentUser'));
        let headers = new Headers();
        headers.append('Authorization', 'Bearer ' + currentUser.token);
        headers.delete('Content-Type');
        let reqOption = new RequestOptions({ headers: headers });
        return this.http.post(API_URL+'/upload', userData, reqOption)
            .map(this.extractData)
            .do(data => console.log('updated profile' + JSON.stringify(data)))
            .catch(this.handleError);
    }
    
    addNewCio(cioData): Observable<Response> {
        // let currentUser = JSON.parse(localStorage.getItem('currentUser'));
        // let headers = new Headers();
        // headers.append('Authorization', 'Bearer ' + currentUser.token);
        // headers.delete('Content-Type');
        // let reqOption = new RequestOptions({ headers: headers });
        console.log("from service ",cioData);
        return this.http.post(API_URL+'/api/createCioProfile', cioData, this.jwt())
            .map(this.extractData)
            .do(data => console.log('created cio profile' + JSON.stringify(data)))
            .catch(this.handleError);
    }
    
    addNewCompany(companyData): Observable<Response> {
        let currentUser = JSON.parse(localStorage.getItem('currentUser'));
        let headers = new Headers();
        headers.append('Authorization', 'Bearer ' + currentUser.token);
        headers.delete('Content-Type');
        let reqOption = new RequestOptions({ headers: headers });
        return this.http.post(API_URL+'/api/createCompanyProfile', companyData, reqOption)
            .map(this.extractData)
            .do(data => console.log('created company profile' + JSON.stringify(data)))
            .catch(this.handleError);
    }

    acceptTheReq(fromCio): Observable<Response> {
        return this.http.post(API_URL+'/api/acceptFriendRequest', fromCio, this.jwt())
            .map(this.extractData)
            .do(data => console.log('just become friend with cio' + JSON.stringify(data)))
            .catch(this.handleError);
    }
    
    addNewDoc(documentData): Observable<Response> {
        let currentUser = JSON.parse(localStorage.getItem('currentUser'));
        let headers = new Headers();
        headers.append('Authorization', 'Bearer ' + currentUser.token);
        headers.delete('Content-Type');
        let reqOption = new RequestOptions({ headers: headers });
        return this.http.post(API_URL+'/api/uploadDocument', documentData, reqOption)
            .map(this.extractData)
            .do(data => console.log('uploaded document' + JSON.stringify(data)))
            .catch(this.handleError);
    }

    getSearchOptions(): Observable<any[]> {

        // get cafe expenses from api
        return this.http.get(API_URL+'/api/getCategoryList', this.jwt())
            .map((response: Response) => response.json().data)
            .catch(this.handleError);
    }

    getAllFriendReq(): Observable<any[]> {
        // get cafe expenses from api
        return this.http.get(API_URL+'/api/getAllFriendRequests', this.jwt())
            .map((response: Response) => response.json().data)
            .catch(this.handleError);
    }

    getAllCIO(): Observable<any[]> {
        // get cafe expenses from api
        return this.http.get(API_URL+'/api/topCioList', this.jwt())
            .map((response: Response) => response.json().data)
            .catch(this.handleError);
    }

    private handleError(error: Response | any) {
        console.log("Error : " + JSON.stringify(error));
        return Observable.throw(error.message);
    }

    private extractData(response: Response) {
        //console.log("response:"+response);
        //let body = JSON.stringify(response);
        //let msg = JSON.parse(body);
        return response.json().message || response.json().data;
    }
    
    private jwt() {
        // create authorization header with jwt token
        let currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (currentUser && currentUser.token) {
            let headers = new Headers();
            headers.append('Authorization', 'Bearer ' + currentUser.token);
            headers.append('Content-Type', 'application/json');
            return new RequestOptions({ headers: headers });
        }
    }

    get isUserLoggedin(){
        if(localStorage.getItem('currentUser') && JSON.parse(localStorage.getItem('currentUser')).token){
            return true;
        }
        else 
            return false;
    }


    ////// Webinar Services

    createWebinarReq(): Observable<Response> {


        
        console.log(this.jwt())
        return this.http.post(API_URL+'/api/createWebinarReq', {}, this.jwt())
            .map(this.extractData)
            .do(data => console.log(JSON.stringify(data)))
            .catch(this.handleError);
    }
    joinWebinar(sessionId): Observable<Response> {


        
        console.log(this.jwt())
        return this.http.post(API_URL+'/api/joinWebinar', sessionId, this.jwt())
            .map(this.extractData)
            .do(data => console.log( JSON.stringify(data)))
            .catch(this.handleError);
    }
    joinWebinarSubscriber(sessionId): Observable<Response> {


        
        console.log(this.jwt())
        return this.http.post(API_URL+'/api/joinWebinarSubscriber', sessionId, this.jwt())
            .map(this.extractData)
            .do(data => console.log( JSON.stringify(data)))
            .catch(this.handleError);
    }
    ////////

}