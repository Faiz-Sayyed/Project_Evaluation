import { useState, useEffect } from "react";
import axios from "axios";

import Loader from "./components/Loader";
import Header from "./components/Header";
import FilterArea from "./components/FilterArea";
import ErrorCard from "./components/ErrorCard";
import DisplayArea from "./components/DisplayArea";

function App() {
  const [mentors, setMentors] = useState([]);
  const [mentor, setMentor] = useState(null);
  const [students, setStudents] = useState([]);
  const [markedStudentsCount, setMarkedStudentsCount] = useState(0);
  const [filter, setFilter] = useState(-1);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);

    const getMentors = async () => {
      await axios
        .get("http://localhost:5000/api/v1/mentors/getMentors")
        .then((response) => {
          setMentors(response.data);
          setMentor(response.data[0]);
        });
    };

    const getStudents = async () => {
      await axios
        .get("http://localhost:5000/api/v1/students/getStudents")
        .then((response) => {
          setStudents(response.data);
        });
    };

    getMentors();
    getStudents();

    setLoading(false);
  }, []);

  useEffect(() => {
    setMentor(mentors[0]);
  }, [mentors]);

  useEffect(() => {
    var count = 0;
    students.forEach((item) => {
      if (
        mentor &&
        mentor.students.includes(item._id) &&
        item.isMarked === true
      ) {
        count++;
      }
    });
    setMarkedStudentsCount(count);
  }, [students, mentor]);

  return (
    <>
      <Header mentor={mentor} />

      {loading ? (
        <Loader />
      ) : (
        <>
          <FilterArea setFilter={setFilter} />

          <div className="bg-gray-200">
            {error && <ErrorCard error={error} />}
          </div>

          <DisplayArea
            mentor={mentor}
            students={students}
            setStudents={setStudents}
            setMentors={setMentors}
            setError={setError}
            markedStudentsCount={markedStudentsCount}
            setMarkedStudentsCount={setMarkedStudentsCount}
            filter={filter}
            setLoading={setLoading}
          />
        </>
      )}
    </>
  );
}

export default App;
