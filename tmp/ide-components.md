

&ltdiv class="hero-unit">

<a class="hiddenLink" id="ide-components"></a>

## IDE Components


&lt/div>


&ltdiv class="hero-unit">

<a class="hiddenLink" id="the-dashboard"></a>

### The Dashboard



From the dashboard you can edit your profile and manage projects and organization.
![The Dashboard Overview](./images/theDashboard.png)

After you have logged in as a user you will be directed to the dashboard of your Cloud9 IDE account. The dashboard consists of two contexts: user context and organization context.

#### User Context
In the left-top corner your username is displayed. Within the user context, you can view your user profile by clicking on 'Your Account' that is placed on top in the left-side panel.
![A snippet of the user context](./images/userContext.png)

The user profile contains:

* Your recent activities, a list of actions you have recently performed within the system, like cloning, opening and closing projects
* Add-on services, a list of services you use a lot to login instantly to Cloud9 IDE. Adding such a service will enable you to access your projects. The list may contain <a title="GitHub" href="http://www.github.com">GitHub</a> and/or <a title="Bitbucket" href="http://www.bitbucket.org"">Bitbucket</a>
* Account settings, where you can configure the following settings:
    * Change your password
    * Change your email
    * Show your SSH key
    * Upgrade to premium
    * Enter promotion code
    * Delete your account
    

The gravatar that is used for your profile is handled by gravatar.com. If you don’t have a gravatar yet, Cloud 9 IDE uses its default:
![Default Gravatar image](./images/gravatarSample.png)

Under 'Your Account' in the left panel, there is a tab called **PROJECTS**. This contains all the projects you added to Cloud 9 IDE. The list will be sorted by Groups depending on your account settings. The groups are:</p>
* My Projects
* Shared Projects
* Organization Projects
* Projects on GitHub (public and private)
* Projects on Bitbucket (public and private)

Clicking the plus sign next to **MY PROJECTS**  allows you to:

* Create a new project
* Clone from URL

![Creating new projects](./images/newProjectCreation.png)

#### Organization Context
Within this context you can organize members to certain projects you want to collaborate on. Creating a project is the same as in user's context. You can remove and add members to your organization by clicking the plus or minus sign in the bottom-left of the dashboard.

After you have added members to your organization you can add them to a certain project. You can click on a member and select the project to collaborate on.

<table border="1">
  <tr>
    <th>1. Select the **MEMBERS** tab</th>
    <th>2. Add members to your organization</th>
    <th>3. Add members to your project</th>
  </tr>
  <tr>
    <td><img src="./images/selectMembers.png" alt ="Selecting Members Screenshot" /></td>
    <td><img src="./images/addMembersToOrg.png" alt ="Adding Members to the Organization" /></td>
    <td><img src="./images/addMembersToProject.png" alt ="Adding Members to Project" /></td>
  </tr>
</table>&lt/div>


&ltdiv class="hero-unit">

<a class="hiddenLink" id="the-console"></a>

### The Console



In this article, you'll learn about the functionality of the console and command-line. The command-line is placed at the bottom of the IDE and shows the console when it is expanded. The Console displays valuable information and response from the system on actions performed by the user. The command-line interface enables the user to interact with the system. You can type commands to perform a typical task.

#### Available Commands
You can use most Unix commands in the console space. To preview the full list of basic commands in the console, you can type `help` and press Enter. For every command, a description is provided:

![Screenshot of the available commands](./images/availableCommands.png)

You can also use mercurial commands (`hg`) and git commands (`git`) to communicate with the system and your favorite add-on services. Typing `hg` or `git` shows the complete list of commands that are available for these services. For more information about these commands, please check their respective documentation:

* [Mercurial Command List](http://mercurial.selenic.com/guide)
* [Git Command List](http://help.github.com/git-cheat-sheets)

To use mercurial commands on the project you are working on, you must have a mercurial project set up. The same holds true for git. Follow these links to learn more about how to set up these project in Cloud 9:

* Setting up a Mercurial Project
* [Setting up a Git project](setting-up-a-github-project)Git

These articles also explain how to use the command-line to push and commit your work.

#### Output:

The output tab in the console shows information whenever a user is running or debugging a program. The content will be similar to the output of a terminal you are used to but it will be in the same window as your editor. No need to juggle between windows anymore!

![Screenshot of some program output](./images/sampleOutput.png)

The output tab also displays the error and additional information that can improve your coding quality. You can use the console to output results from your running application, just like a regular terminal.&lt/div>


&ltdiv class="hero-unit">

<a class="hiddenLink" id="the-editor"></a>

### The Editor



In this article we explore the functionality of the editor. The editor is where you write and edit your code. You launch the editor from the dashboard when you click the **Start Editing** button:
![Screenshot of the Start Editing button](./images/startEditingButton.png)

Clicking on **Start Editing** results in the editor popping up in a new browser tab:
![Screenshot of the different IDE sections](./images/idePartitions.png)

We can identify six distinct areas in the editor:

* The top menu bar is the uppermost area with menus, debug/run buttons, and shortcuts to home and the dashboard
* The project bar lets you select views for your project files, active files, preferences for the editor and deploy options
* The panel displays views according to what you select in the project bar
* The toolbar is on the right-hand side, where you can find tools to check the call stack, monitor variables, and breakpoints.</li>
* The code editor is the main central area where you write your code.
* The console is the bottom area of the window. This can act like a desktop terminal to enter command line input, or, it can display output printed from your program

The first five areas of the editor are described below. Since the console is so powerful, its help can be found elsewhere. 

#### The Top Menu Bar
![A screenshot of the top menu bar](./images/topMenuBar.png)

Here you can find the usual menus for creating andsaving files, changing your view, and switching windows. You also find shortcut buttons for saving and opening a file. 

In the middle of the menu bar, are the run and debug buttons. You can press **run** to execute your Node.js applications. While your application is running, it opens up in a new browser tab and the *stop** button becomes active (so that you can stop your application).

When you debug your application (by pressing the **debug** button), the play, pause and stepping buttons become active, so that you can properly step through your code while looking for bugs. 

On the far right of the menu are two more icons: one for the dashboard and one for home. These are just shortcuts to go back to the dashboard or the Cloud9 IDE home page, respectively.

#### The Project Bar and Panel

On the left side section of the editor is the Project bar. It has four large buttons. From top to bottom, they are: **Project Files**, **Active Files**, **Preferences**, and **Deploy**. Pressing any of these buttons activates a different view in the panel to the right of the buttons. In more detail:

* **Project Files**: Activates a view of your project's directory structure, which appears in the panel to the right. You can view all your files here. Right-click in this area to access a a drop-down menu to create new files, copy/paste and other options.
* **Active Files**: Activates a view of the files that are currently open.
* **Preferences**: Gives you access to general settings and editor settings
* **Deploy**: Allows you to create a Heroku or Joyent No.de deploy server.


#### The Toolbar
In the toolbar, there are tools for debugging your Javascript code. These include a call stack viewer, and viewers for variables and breakpoints. In the future, you'll be able to find more tools, among them the team collaboration tools.

#### The Code Editor
This is where most of the action happens. The files you open appear here as tabs. You can open a new file easily by clicking on the **+** sign to the right of the last tab. Cloud 9 IDE offers syntax highlighting and basic code completion for most popular programming languages. For Javascript, we offer mode advanced code completion.

The code editor supports a large number of keyboard shortcuts to increase your productivity. They are too many to include on this page, so they have [their own article](#key-bindings).

The last element of the editor, the console, is not covered in this article. It is an essential feature and it requires [its own article](console).&lt/div>
