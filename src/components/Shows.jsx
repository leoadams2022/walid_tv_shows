import React from "react";
import useStore from "../zustand/useStore";
import { useShallow } from "zustand/shallow";
import { getTVDetails } from "../tmdb/tv";
import { Badge, TextInput } from "flowbite-react";
import { FaStar } from "react-icons/fa";
import { MdOutlineAddToQueue } from "react-icons/md";
import {
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from "flowbite-react";
import { addShow, getShowById } from "../database/db";

export default function Shows() {
  const [openModal, setOpenModal] = React.useState(false);
  const [openDeleteModal, setOpenDeleteModal] = React.useState(false);
  const [showIdToDelete, setShowIdToDelete] = React.useState(null);

  const { shows, showId, setShowId, addShowById, removeShowById } = useStore(
    useShallow((s) => ({
      shows: s.shows,
      showId: s.showId,
      setShowId: s.setShowId,
      addShowById: s.addShowById,
      removeShowById: s.removeShowById,
    })),
  );
  const [data, setData] = React.useState(null);
  const [showIdInput, setShowIdInput] = React.useState(null);

  const addNewShowById = () => {
    const newShowId = Number(showIdInput);
    if (!newShowId) {
      console.error("No id provided");
      alert("No id provided");
      return;
    }

    if (shows.find((show) => show.id === newShowId)) {
      console.error("Show already exists");
      alert("Show already exists");
      return;
    }
    addShowById(newShowId);
    setOpenModal(false);
    setShowIdInput("");
  };

  const deleteShowById = () => {
    removeShowById(showId);
    setOpenDeleteModal(false);
  };

  React.useEffect(() => {
    (async () => {
      const showsPromises = shows.map(async (s) => {
        let show_info;
        const local_show = await getShowById(`${s.id}_show_info`); // localStorage.getItem(`${s.id}_show_info`);

        if (local_show) {
          const local_show_info = local_show.data; // JSON.parse(local_show);
          show_info = local_show_info;
        } else {
          try {
            const fetched_show_info = await getTVDetails(s.id, {
              append_to_response: "images,credits",
            });
            // localStorage.setItem(
            //   `${s.id}_show_info`,
            //   JSON.stringify(fetched_show_info),
            // );

            await addShow({
              id: `${s.id}_show_info`,
              data: fetched_show_info,
            });
            show_info = fetched_show_info;
          } catch (e) {
            console.error(
              "was not able to fetch show info for show id: ",
              typeof s.id,
            );
            console.error(e);
            return null;
          }
        }

        return show_info;
      });

      const show_info = (await Promise.all(showsPromises)).filter((s) => s);
      // console.log("show_info: ", show_info);
      setData(show_info);
    })();
  }, [shows]);
  if (!data) return <p>loading...</p>;
  return (
    <div className="container mx-auto p-4 relative">
      {/* Shows Grid  */}
      <div
        className={`flex flex-wrap gap-6 md:gap-8 place-content-center place-items-center`}
      >
        {data.map((s) => (
          <div
            onClick={() => setShowId(s.id)}
            key={s.id}
            className={`w-82 rounded-lg shadow-lg relative cursor-pointer hover:scale-110 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-2xl ${showId === s.id ? "ring-2 ring-sky-500" : ""}`}
          >
            <img
              src={`https://image.tmdb.org/t/p/w500${s.backdrop_path}`}
              alt={s.name}
              className="w-full h-auto rounded-t-lg"
            />
            <div className="w-full h-12 rounded-b-lg bg-pop text-pop p-2">
              <h3 className="text-lg font-semibold line-clamp-1">{s.name}</h3>
            </div>
            <div className=" absolute top-0 left-0 w-full flex justify-between p-1">
              <Badge color="success" size="xs">
                {s.number_of_seasons} Season
              </Badge>
              {/* <Badge color="success">{s.air_date}</Badge> */}
              <Badge color="warning" size="xs">
                <div className="flex items-center gap-1">
                  {s.vote_average} <FaStar />
                </div>
              </Badge>
            </div>
            <div className=" absolute bottom-12 left-0 w-full flex justify-between p-1 gap-1">
              <Badge color="success" size="xs">
                {s.first_air_date}
              </Badge>
              <Badge
                onClick={(e) => {
                  e.stopPropagation();
                  setShowIdToDelete(s.id);
                  setOpenDeleteModal(true);
                  // removeShowById(s.id);
                }}
                color="failure"
                size="xs"
              >
                Delete
              </Badge>
            </div>
          </div>
        ))}
      </div>
      <button
        className={`fixed bottom-4 left-4 w-12 h-12 rounded-full bg-pop text-pop p-2 flex items-center justify-center text-2xl hover:scale-110 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-2xl hover:ring-2 hover:ring-sky-500 cursor-pointer`}
        onClick={() => setOpenModal(true)}
      >
        <MdOutlineAddToQueue />
      </button>
      <Modal show={openModal} onClose={() => setOpenModal(false)}>
        <ModalHeader>Add Show By TMDB ID</ModalHeader>
        <ModalBody>
          <div className="space-y-6">
            <TextInput
              onChange={(e) => {
                let val = e.target.value;
                val = val.replace(/[^0-9]/g, "");
                setShowIdInput(val);
              }}
              value={showIdInput}
              placeholder="TV Show TMDB ID"
            />
          </div>
        </ModalBody>
        <ModalFooter>
          <Button onClick={() => addNewShowById()} disabled={!showIdInput}>
            Add
          </Button>
          <Button onClick={() => setOpenModal(false)}>Cancel</Button>
        </ModalFooter>
      </Modal>
      <Modal show={openDeleteModal} onClose={() => setOpenDeleteModal(false)}>
        <ModalHeader>Delete Show</ModalHeader>
        <ModalBody>
          <div className="space-y-6 text ">
            <p>Are you sure you want to delete this show?</p>
            <p>{data.find((s) => s.id === showIdToDelete)?.name}</p>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button color="red" onClick={() => deleteShowById()}>
            Delete
          </Button>
          <Button onClick={() => setOpenDeleteModal(false)}>Cancel</Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}
