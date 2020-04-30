<h1>REST API on Bootcamps</h1>

<h3> This is an api to deploy your bootcamps and courses</h3>

<h6>A bootcamp is a collection of course of a particular author</h6>

<h2 style="color:green">Features of this course</h2>

<h3>Bootcamps</h3>
    <li>Get all bootcamps</li>
    <li>Get bootcamp by id</li>
    <li>Create a bootcamp</li>
    <li>Delete a bootcamp</li>
    <li>pagination</li>
    <li>Calculate average cost of each bootcamp</li>
    <li>Calculate average rating for each bootcamp</li>
<h3>Courses</h3>
<li>Add a course to a bootcamp</li>
<li>Get all courses</li>
<li>Get courses associated with a particular bootcamp</li>
<li>Update a course</li>
<li>Delete a course</li>

<h3>Authentication/Users</h3>
<li>Use jwt to get a token when a user signs in or log in</li>
<li>Add a user</li>
<li>Password encription</li>
<li>Role authorization</li>
<li>Delete update user</li>
<li style="color:yellow">Create a token for forgot password and send it to the user</li>
<li style="color:yellow">Reset password</li>
<li>Logout to clear the login/signin token</li>
<h1 style="color:blue">Bootcamp route</h1>



<h3>Security</h3>
<li>No sql injection protection</li>
<li>Xss protection</li>
<li>Limit the number of request</li>
<h3>Reviews</h3>
<li>Add delete update a review</li>
<li>Get review with bootcamp id</li>
<br/>

<li style="color:darkgreen"> <h2>Get all bootcamps</h2>
</li>
<h4 style="color:yellow">Access : public <BR/>  GET REQUEST</h4>

```
http://localhost:5002/api/v1/bootcamps
```

<li style="color:darkgreen"> <h2>Get bootcamp by id</h2>
</li>
<h4 style="color:yellow">Access : public <BR/>  GET REQUEST</h4>

```
http://localhost:5002/api/v1/bootcamps/bootcampid
```






<li style="color:darkgreen"> <h2>Create new bootcamp</h2>
</li>
<h4 style="color:yellow">Access : private/publisher <BR/>  POST REQUEST</h4>

```
http://localhost:5002/api/v1/bootcamps
```
<p> The req body syntax is as follows :</p>

```json
  {
    "name": "Bootcamp",
    "description": "Devworks is a full stack JavaScript Bootcamp located in the heart of Boston that focuses on the technologies you need to get a high paying job as a web developer",
    "website": "https://dev.com",
    "phone": "(111) 111-1111",
    "email": "enroll@devworks.com",
    "address": "233 Bay State Rd Boston MA 02215",
    "careers": ["Web Development", "UI/UX", "Buisness"],
    "housing": true,
    "jobAssistance": true,
    "jobGuarantee": false,
    "acceptGi": true
  }
```

<li style="color:darkgreen"><h2>Update a bootcamp</h2>
</li>
<h4 style="color:yellow">Access : private/publisher <BR/>  PUT REQUEST</h4>

```
http://localhost:5002/api/v1/bootcamps/bootcampId
```
<p><b>*All the files are to be passed in request.body</b></p>


<li style="color:darkgreen"> <h2>Delete a bootcamp</h2>
</li>
<h4 style="color:yellow">Access : private/publisher <BR/>  DELETE REQUEST</h4>

```
http://localhost:5002/api/v1/bootcamps/bootcampId
```

<h1 style="color:blue">Course route</h1>
<h3 style="color:green">*A bootcamp may have multipe courses</h3>
<li style="color:darkgreen"><h2>Get all courses</h2>
</li>
<h4 style="color:yellow">Access : public <BR/>  GET REQUEST</h4>

```
http://localhost:5002/api/v1/courses
```

<li style="color:darkgreen"><h2>Get all courses of a specific bootcamp</h2>
</li>
<h4 style="color:yellow">Access : public <BR/>  GET REQUEST</h4>

```
http://localhost:5002/api/v1/bootcamp/:bootcampId/courses
```


<li style="color:darkgreen"><h2>Create a course</h2>
</li>
<h4 style="color:yellow">Access : private/publisher <BR/>  POST REQUEST</h4>

```
http://localhost:5002/api/v1/bootcamp/:bootcampIdofthecourse/courses
```
<p>Dummy data</p>

```json
{
			"scholarshipAvailable": false,
            "title": "Front End Web Development 2",
            "description": "This course will provide you with all of the essentials to become a successful",
            "weeks": "8",
            "tuition": 8000,
            "minimumSkill": "beginner"
}
```

<li style="color:darkgreen"><h2>Update a course</h2>
</li>
<h4 style="color:yellow">Access : private/publisher <BR/>  PUT REQUEST</h4>

```
http://localhost:5002/api/v1/bootcamp/:bootcampIdofthecourse/courses
```
*The updated fields should be in the req.body as a json data


<li style="color:darkgreen"><h2>Delete a course</h2>
</li>
<h4 style="color:yellow">Access : private/publisher <BR/>  PUT REQUEST</h4>

```
http://localhost:5002/api/v1/courses/:courseId
```





