import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router";
import Soundfont from "soundfont-player";
import "./styles/ProfilePage.css";
import CreateProject from "../components/CreateProject";
import ProjectCardAI from './../components/ProjectCardAI'
import ProjectsSelect from "../components/ProjectsSelect";
import Playback from "../components/Playback";
import VideoTuts from "../components/VideoTuts";
import axios from "axios";
import { useContext } from "react";
import LoginContext from "../context/LoginContext";

const notes = [
  { note: "C3", isBlack: false },
  { note: "C#3", isBlack: true },
  { note: "D3", isBlack: false },
  { note: "D#3", isBlack: true },
  { note: "E3", isBlack: false },
  { note: "F3", isBlack: false },
  { note: "F#3", isBlack: true },
  { note: "G3", isBlack: false },
  { note: "G#3", isBlack: true },
  { note: "A3", isBlack: false },
  { note: "A#3", isBlack: true },
  { note: "B3", isBlack: false },
  { note: "C4", isBlack: false },
  { note: "C#4", isBlack: true },
  { note: "D4", isBlack: false },
  { note: "D#4", isBlack: true },
  { note: "E4", isBlack: false },
  { note: "F4", isBlack: false },
  { note: "F#4", isBlack: true },
  { note: "G4", isBlack: false },
  { note: "G#4", isBlack: true },
  { note: "A4", isBlack: false },
  { note: "A#4", isBlack: true },
  { note: "B4", isBlack: false },
];

var arr = [];

function ProfilePage({setShowLogin}) {

  const user = useContext(LoginContext);

  // this is the link to the LIVE SERVER
  const remoteUsers = `${import.meta.env.VITE_APP_API_URL}/users`;
  const remoteTracks = `${import.meta.env.VITE_APP_API_URL}/tracks`;
  // this is the link to songs
  const remote = `${import.meta.env.VITE_APP_API_URL}/songs`;

  const [showCreate, setShowCreate] = useState(false);
  const [showRecord, setShowRecord] = useState(false);
  const [player, setPlayer] = useState(null);
  const [audio, setAudio] = useState(false);
  const [track, setTrack] = useState(null);
  const [song, setSong] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [notesText, setNotesText] = useState("");
  const [notesPositions, setNotesPositions] = useState([]);
  const [selectedProject, setSelectedProject] = useState("");
  const [showPlayback, setShowPlayback] = useState(false);
  const [showTutorials, setShowTutorials] = useState(false);
  const [showProjects, setShowProjects] = useState(true);
  const [dateToday, setDateToday] = useState("");
  const [solvedC, setSolvedC] = useState(false);
  const [challenge, setChallenge] = useState(false);
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
 
  useEffect(() => {
    if(!user.loggedIn){
      navigate("/");
      setShowLogin(true);
    }
    
    let dt = new Date(Date.now());
    let formatDt = dt.toLocaleDateString();
    setDateToday(formatDt);
    setCurrentUserId(user.id);

    getProjectsWithParams().then(function (result) {
      console.log(result.data);
      setProjects(result.data);
    })
  }, []);

  useEffect(() => {
    Soundfont.instrument(new AudioContext(), "acoustic_grand_piano").then(
      (instrument) => {
        setPlayer(instrument);
      }
    );
  }, []);

  const addNewTrackToProject = async (trackData) => {
    //console.log(trackData);
    return await axios
      .post(remoteTracks, trackData)
      .then(function (response) {
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const playNote = (note) => {
    if (player) {
      player.play(note);
      if (showRecord) {
        setNotesText([...notesText, note]);
        getPositionForPlayback(note);
      }
    }
  };

  const handleRecord = () => {
    setShowRecord(!showRecord);
  };

  const handlePlay = () => {
    setAudio(!audio);
  };
  const createProject = () => {
    setShowCreate(!showCreate);
  };

  function getPositionForPlayback(note) {
    // this depends on the keyboard the user uses to playback songs
    // this has to remain dynamic because of mobile view
    // for the demo we use C3
    //console.log(note);
    const position = 3;
    let index,
      notePos = note.charAt(note.length - 1);
    const useMobileLayout = [
      "C#" + position,
      "Eb" + position,
      "F#" + position,
      "G#" + position,
      "Bb" + position,
      "C#" + (position + 1),
      "Eb" + (position + 1),
      "F#" + (position + 1),
      "G#" + (position + 1),
      "Bb" + (position + 1),
      "C" + position,
      "D" + position,
      "E" + position,
      "F" + position,
      "G" + position,
      "A" + position,
      "B" + position,
      "C" + (position + 1),
      "D" + (position + 1),
      "E" + (position + 1),
      "F" + (position + 1),
      "G" + (position + 1),
      "A" + (position + 1),
      "B" + (position + 1),
    ];
    //for (let i=0; i<tune.length; i++){
    let replace = "";
    if (note.includes("D#")) {
      replace = "Eb" + notePos;
    }
    if (note.includes("A#")) {
      replace = "Bb" + notePos;
    }
    //console.log(replace);

    if (replace.length > 0) {
      for (let i = 0; i < useMobileLayout.length; i++) {
        const element = useMobileLayout[i];
        if (element == replace) {
          index = i;
          arr.push(index);
        }
      }
    } else {
      for (let i = 0; i < useMobileLayout.length; i++) {
        const element = useMobileLayout[i];
        if (element == note) {
          index = i;
          arr.push(index);
        }
      }
    }

    //console.log(arr);
    setNotesPositions(arr);
  }

  const save = () => {
    console.log("track added to -> ", selectedProject, notesPositions, notesText);
    console.log("challenge -> ", challenge);
    let durationA = notesText.length * 0.5;
    let challengGame=null; let solution=[]; let solvedIt=false;
    if(challenge){
      solution = ["C3","D3","E3","F3","G3","A3","B3","C4"];
      if(notesText.toString()===solution.toString()){
        solvedIt = true;
        setSolvedC(true);
        console.log(solvedIt , notesText.toString()===solution.toString());
        challengGame = dateToday;  
      }
    }
    let instructions = prompt("Any instructions to add?", "e.g. left-hand or daily challenge");
    const track = {
      instructions: instructions,
      notes: notesText,
      songId: selectedProject,
      notesPositions: notesPositions,
      duration: durationA,
      challengeGame: challengGame,
      isChallenge: challenge,
      solutionCg: solution,
      solved: solvedIt
    };
    //console.log(track, notesPositions);
    if (notesPositions.length === notesText.length) {
      setTrack(track);
      addNewTrackToProject(track);
      setShowRecord(false);
      setShowPlayback(true);
      arr=[];
    }
  };

  const selectProject = (id) => {
    //console.log(id);
    setSelectedProject(id);
  };

  const handleCheckChange = (e) => {
    let checked = e.target.checked;
    if(checked==true){
      setChallenge(true);
    }else{
      setChallenge(false);
    }
  };

  const handleDelete = async (id) => {
    console.log(id);
    let result = [];
    // change the link depending on the environment 
    const url = remote + '/' + id;
       try {
        const res = await axios.delete(url);
        if(res.status===200){
          getProjectsWithParams().then(function (result) {
            console.log(result.data);
            setProjects(result.data);
          });  
        }
      } catch (error) {
        console.error(error);
      }
   }

  async function getProjectsWithParams() {
    const params = {userId: user.id};
    try {
      // change the link depending on the environment 
      return await axios({url: remote, 
        method: 'get',
        timeout: 8000,
        headers: {
            'Content-Type': 'application/json',
        },
        params: params
      })
    } catch (error) {
      console.error(error);
    }
  }

  const callback = () => {
    getProjectsWithParams().then(function (result) {
      console.log(result.data);
      setProjects(result.data);
    })
  }

  return (
    <div className="profile-page">

      {/* Main Content */}
      <div className="main-content">
        {/* Left Side: Piano */}
        <div className="top-intro">
        <div className="daily-challenge"> *Daily challenge { dateToday } : Record a C major scale (ascending) <br/>
          <div style={{display: 'flex', flexDirection:'row'}}><h1>Welcome to your workspace </h1><img src={user.image}
            alt="User profile image"
            style={{ marginLeft: "15px", width: "50px", height: "50px", borderRadius: "50%" }}/></div>
          Play on the piano, Record a track, Access Tutorials picked for you - all in one workspace<br/>
          Don't know how do do the challenge? Watch a tutorial on the subject
        </div>
        </div>
       

        <div>
          <button
            className="create-project"
            style={{ width: "130px" }}
            onClick={(e) => setShowTutorials(!showTutorials)}
          >
            {showTutorials?"Hide Tuts":"Show Tuts"}
          </button>
          <button
            className="create-project"
            style={{ width: "130px" }}
            onClick={(e) => setShowProjects(!showProjects)}
          >
            {showProjects?"Hide Songs":"Show Songs"}
          </button>
        </div>


        {showRecord && <div>{user.fullName} is currently Recording </div>}

       <div className="workspace-layout" style={{display: 'flex', flexDirection: 'row'}}> 

       {showTutorials && (
          <div style={{marginRight: "15px"}}>
            <VideoTuts />
          </div>
        )}

        <div className="piano-container">
          <h2>Virtual Piano</h2>
          <div className="piano-keys">
            {notes.map((key, index) => (
              <div
                key={index}
                className={key.isBlack ? "black-key" : "white-key"}
                onClick={() => playNote(key.note)}
              >
                {key.isBlack ? "" : key.note}
              </div>
            ))}
          </div>
          </div>

          {showProjects && (
          <div className="contains-projects-list-ai" >
            <div style={{color:'white', padding: '10px'}}>
              Your Existing Projects: Click on a song to go into edit and
              playback mode
            </div>

            <div className="projects-list">
             {projects?.map(project => 
                  <ProjectCardAI key={project.id} id={project.id} image={project.image} title={project.title} description={project.description} handleDelete={handleDelete} /> 
             )} 
        </div>
          </div>
        )}

        </div>
        {/* Right Side: Recorded Section */}
        {showRecord && (<div className="recorded-section">
             <label> Select the checkbox if you wish to take part <br/> in the daily challenge with this recording
                <input type="checkbox" name="challenge" onChange={e=>(handleCheckChange(e))}/>
             </label><br/>
             {(challenge===true) ? `Daily challenge ${ dateToday } : Record a C major scale (ascending)`: "" }
            <h3>Recorded Melody</h3>
            <textarea
              style={{ maxHeight: "120px" }}
              value={notesText}
              className="recorded-display"
              readOnly
            ></textarea>
            <button onClick={save}>Save</button>
          </div>
        )}
      
     
      </div>

      {showCreate && <CreateProject userId={user.id} callback={callback}/>}

      <div className="spacer"></div>

      {/* Bottom Player */}
      <div className="bottom-player">
        <button
          className="create-project"
          style={{ width: "130px" }}
          onClick={createProject}
        >
          {showCreate ? "Return" : "Create New"}
        </button>
        {!selectedProject && <label>Start a recording for any of your projects(songs)</label>}
        <ProjectsSelect
          projects={projects}
          selectProject={selectProject}    
        />
        {selectedProject && (
          <div>
            <button className="record-button" onClick={handleRecord}>
              Record
            </button>
            <div className="playback-controls">
              {showPlayback && <div><Playback playSong={track} /><button onClick={e=>setShowPlayback(!showPlayback)}>Close</button></div>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProfilePage;
