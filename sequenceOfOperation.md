## Render credentials
    mohammadwajahathzaman@gmail.com (using google)

## Netlify cerdentials
    mohammadwajahathzaman@gmail.com (using google)



# Sequence of Operation

In this file we are going to understand how a full stack website made with MERN actually operates.
We are going to use the MERN DATA-ANALYST PORTFOLIO website for our study

1. When the user first visits the portfolio page index.html is rendered. In that there is a "div" inside the body where our react component goes. This happens in the main.jsx file. (JSX is an advance version of html with strict laws and its called Java Script XML).

2. In the main.jsx file we enclose the APP inside the BROWSER ROUTER which is required for route Handling. All our pages are inside the App.jsx file.

3. In App.jsx, we define the routes and the elements that are to be rendered in the webpage when these routes are called. For that purpose we use ROUTES and ROUTE from REACT-ROUTER-DOM. All the routes are Enclosed by ROUTES and each route is defined using ROUTE with a PATH and an ELEMENT.
              <Route path="/" element={<Home />} />
Now before calling the Routes we have used a NAVBAR and a FOOTER which will always be there irrespective of routes.
    
4. When the user visits the page that is "wajahathzaman.netlify.app" the path is "/", hence the HOME element will be rendered.

In the home page there are 5 sections which are created in a folder called sections. 
- The sections are
    - Hero
    - Project Preview Section
    - SQL
    - Python 
    - Contact

- We added a scroll to section functionality in this page for contact section. To create that we need to follow the below steps:
    - We first import the "useRef" hook into the file and defines it to a const with an initial value as NULL. [The purpose of useRef is to add a reference to a DOM Element and manipulate it directly].
    - Then we create the handler function which helps us have the scroll effect:
        
        const handleScrollToContact = () => {
            contactRef.current?.scrollIntoView({ behavior: 'smooth' });
        };

    - Then we pass this function as a prop inside the Hero section where there is button that says "Contact Me". Then we will use this prop inside the onClick functionality in the button. 
    - So when someone clicks on the button the function is called and scrolling effect is achieved.

- Hero section has Name as title, a para as description, a contact me button and a picture
- Project preview section is used to show 4 projects that has been done and saved in the database.

    - We first import useState and create an const called Projects with useState([]) which is an empty list.
    - Then we import and use the useEffect hook inside which we call an arrow function which is used to fetch and get the project. The code is like this:
            
            useEffect(() => {
              api.get("/projects?limit=4")
                .then(res => setProjects(res.data))
                .catch(err => console.error("Error fetching project preview:", err));
            }, []);

    - We have used the complete address in a seperate file called as api.js inside utilities. Which has the code
            
            import axios from "axios";

            // Use Vite environment variable
            const baseURL = import.meta.env.VITE_API_BASE_URL;


            const api = axios.create({
            baseURL,
            headers: {
                "Content-Type": "application/json",
            },
            withCredentials: true
            });

            export default api;
            
            and in the .env file in the frontend has this variable as:

            VITE_API_BASE_URL=https://data-analyst-portfolio.onrender.com/api

            which is the backend url from Render.
        
        - So as soon this element is rendered on the webpage the useEffect runs and sends the request to the backend where there is a route defined to response for this request. The code as follows:
            
            export const getAllProjects = async (req, res) => {
                try {
                    const limit = parseInt(req.query.limit) || 0;
                    const projects = await Projects.find()
                    .sort({ createdAt: -1 })
                    .limit(limit);

                    res.status(200).json(projects);
                } catch (error) {
                    console.error("Error in getAllProjects controller:", error);
                    res.status(500).json({ error: "Internal Server Error." });
                }
                };

            The above code can be understood like this:
            - The frontend makes the reqest at https://data-analyst-portfolio.onrender.com/api/projects?limit=4 which is sending a limiting amount as a query parameter. (We can add multiple query parameters by seperating them using & symbol).
            - The backend gets this request. It takes the limit element and assign it to a const after we convert the string into an integer using parseInt function.
            - Then we use mongoDB functions to fetch the projects. This sorting is done to get the latest created projects and the limit is used to limit the response that we are getting.
            - Then we are sending this projects to the frontend in terms of json.

        - The frontend then assigns this response the empty array called as projects using the setProjects functionality.

    - The project preview section has a heading, 2 div.
        - One div uses the .map() feature on the array of projects that was recieved from the backend. Each project is displayed using a projectCard.

            - ProjectCard contains:
              - project title
              - A view project button that is always visible and takes us to the project detail page using the id that we sendin using the " ` ".
                  - View project button will take us to route of "/project/:id" of which the element is <ProjectDetail />.
                  - In Project Detail Page:
                    - we catch hold of the id from the params with help of "useParams()" from "react-router-dom".
                    - Then we send the request using the useEffect(), and in the second argument we specify [id] as everytime the id changes the useEffect reRenders.
                    - Using the useState we get hold of the project and setProject then we use its title as heading and various things. 
                    - Here a creative feature is the <TableauEmbed /> component that takes in the tableauLink as a url that is being provided from the user in the add project form (which is described later on in the file.)
                    - <TableauEmbed />
                        -  It is the JS API from tableau provided to showcase the dashboard on our website.

              - A funcion which checks if the user is logged in and shows the edit or delete project button. This isLoggedIn function is being passed as prop from the parent page which is the all projects page.

        - Other div contains the buton that links to the "/projects" route on the frontend whose element is <Project /> from the Projects.jsx page.
        - The ALL Projects Page:
          - useStates:
                const [projects, setProjects] = useState([]);
                const [isLoggedIn, setIsLoggedIn] = useState(false);
                const navigate = useNavigate();
                const location = useLocation();

          - Functions:
            - useEffect to get the projects but without limit this time. It also has a checkAuth functionality.
                  
                  useEffect(() => {
                    api.get("/projects")
                    .then((res) => setProjects(res.data))
                    .catch((err) => console.error("Error fetching all projects:", err));

                    const checkAuth = async () => {
                    const loggedIn = await checkLoggedin();
                    setIsLoggedIn(loggedIn);
                    };

                    checkAuth();
                  }, []);

                - We define the checkLoggedIn function in the sessionCheck.jsx file and the code goes as
                    
                    export async function checkLoggedin() {
                        try {
                            await api.get("/auth/session", { withCredentials: true });
                            return true;
                        } catch  {
                            return false;
                        }
                    }

                - This sends request to the backend which handles this using the defind route and send response in json format as loggedIn: true.

            - Then we have a handle login functionality that we handle using navigate with state object as location to get back to this page after a successful login.
            - We handle delete by navigating the user to the delete project route using navigate.
            - We handle the add project request by navigating the user to the add project form.
            - THE ADD PROJECT FORM:
                - In this we take the details of the project that the user enters and append it into a const called as formData and then we send the post request to the backend with the formData constant.

          - Contents:
            - Title
            - A function to show different buttons.
                - A login button if the user is not loggedIn. This button takes us to the login page using navigate.
                - If the user is logged in.
                  - Add project button to add the project and A logout button.
            - A Project card functionality for each project using the .map() function.

- SQL section where the leetcode api is being used to get the problem solving detail from leetcode for SQL
- Python section where the codewars api is being used to get the problem solving details from codewars for python
- Then A contact me section where i am using the emailJS package for emails.


### Adding a new feature steps:

1. Go to the path of the project and then check these git commands.
```console
    git status        # Shows current branch
    git checkout main # Go to main branch (if not already there)
    git pull origin main # Get latest code from GitHub main
```

2. Create a new feature branch.
```console
    git checkout -b feature/toggle-content-mode
```

3. Open the code and make the changes in that code where ever required.