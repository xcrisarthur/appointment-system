import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api/axios";
import Select from "react-select";
import moment from "moment-timezone";
import "../css/ParticipantsPage.css";

export default function ParticipantsPage() {
	const { id } = useParams();
	const [data, setData] = useState(null);
	const [users, setUsers] = useState([]);
	const [selectedUsers, setSelectedUsers] = useState([]);
	const [showAdd, setShowAdd] = useState(false);
	const [editMode, setEditMode] = useState(false);
	const [title, setTitle] = useState("");
	const [start, setStart] = useState("");
	const [end, setEnd] = useState("");
	const [user, setUser] = useState(null); // user login

	const fetchData = () => {
		api
			.get(`/appointments/${id}`)
			.then((res) => {
				setData(res.data);
				setTitle(res.data.title);
				setStart(res.data.start.slice(0, 16));
				setEnd(res.data.end.slice(0, 16));
			})
			.catch((err) => {
				console.error(err);
				alert("Gagal ambil data appointment");
			});
	};

	useEffect(() => {
		fetchData();

		// ambil user login
		api
			.get("/api/auth/me")
			.then((res) => setUser(res.data))
			.catch(() => alert("Gagal ambil data user login"));

		// ambil semua user
		api
			.get("/users")
			.then((res) => setUsers(res.data))
			.catch(() => alert("Gagal ambil daftar user"));
	}, [id]);

	// format waktu sesuai timezone creator
	const formatDateTime = (isoString, tz) => {
		return moment(isoString).tz(tz).format("YYYY-MM-DD HH:mm");
	};

	const handleAddParticipants = async () => {
		if (!data || selectedUsers.length === 0) return;
		try {
			for (let user of selectedUsers) {
				await api.post("/api/participants", {
					appointmentId: data.id,
					userId: user.value,
				});
			}
			alert("Participants berhasil ditambahkan");
			setShowAdd(false);
			fetchData();
		} catch (err) {
			console.error(err);
			alert("Gagal menambahkan participants");
		}
	};

	const handleDeleteParticipant = async (userId) => {
		if (!data) return;
		try {
			await api.delete(`/api/participants/${data.id}/${userId}`);
			alert("Participant berhasil dihapus");
			fetchData();
		} catch (err) {
			console.error(err);
			alert("Gagal menghapus participant");
		}
	};

	const handleEditAppointment = async () => {
		if (!data) return;
		try {
			await api.put(`/appointments/${id}`, {
				title,
				start: new Date(start).toISOString(),
				end: new Date(end).toISOString(),
				creator_id: data.creator_id,
				participants: data.participants.map((p) => p.id),
			});
			alert("Appointment berhasil di-update");
			setEditMode(false);
			fetchData();
		} catch (err) {
			console.error(err);
			alert("Gagal mengupdate appointment");
		}
	};

	const participantIds = data?.participants.map((p) => p.id) || [];

	const options = users
		.filter((u) => !participantIds.includes(u.id))
		.map((u) => ({
			value: u.id,
			label: `${u.name} (@${u.username})`,
		}));

	const isCreator = user && data && user?.user.sub === data?.creator_id;

	return (
		<div className="container">
			<Link to="/appointments" className="back-link">
				&larr; Back
			</Link>
			<h1>Participants</h1>

			{!data && <div className="loading">Loading...</div>}

			{data && (
				<>
					<div className="appointment-info">
						{editMode ? (
							<div className="edit-form">
								<input
									type="text"
									value={title}
									onChange={(e) => setTitle(e.target.value)}
									placeholder="Title"
								/>
								<label>Start</label>
								<input
									type="datetime-local"
									value={start}
									onChange={(e) => setStart(e.target.value)}
								/>
								<label>End</label>
								<input
									type="datetime-local"
									value={end}
									onChange={(e) => setEnd(e.target.value)}
								/>
								<div className="edit-buttons">
									<button onClick={handleEditAppointment}>Save</button>
									<button
										onClick={() => setEditMode(false)}
										className="cancel-btn">
										Cancel
									</button>
								</div>
							</div>
						) : (
							<div className="appointment-details">
								<div>
									<b>Title:</b> {data.title}
								</div>
								<div>
									<b>Start:</b>{" "}
									{formatDateTime(data.start, data.creator.preferred_timezone)}
								</div>
								<div>
									<b>End:</b>{" "}
									{formatDateTime(data.end, data.creator.preferred_timezone)}
								</div>
								<div>
									<b>Timezone:</b> {data.creator.preferred_timezone}
								</div>
								{isCreator && (
									<button
										className="edit-btn"
										onClick={() => setEditMode(true)}>
										Edit Appointment
									</button>
								)}
							</div>
						)}
					</div>

					<ul className="participants-list">
						{data.participants.length > 0 ? (
							data.participants.map((p) => (
								<li key={p.id} className="participant-item">
									<div className="participant-name">{p.name}</div>
									<div className="participant-details">
										@{p.username} — TZ: {p.preferred_timezone}
									</div>
									{isCreator && (
										<button
											className="delete-btn"
											onClick={() => handleDeleteParticipant(p.id)}>
											Delete
										</button>
									)}
								</li>
							))
						) : (
							<li className="participant-item">Belum ada peserta.</li>
						)}
					</ul>

					{isCreator && (
						<>
							<button className="add-btn" onClick={() => setShowAdd(!showAdd)}>
								{showAdd ? "Cancel" : "Add Participant"}
							</button>

							{showAdd && (
								<div className="add-participant-form">
									<Select
										isMulti
										options={options}
										value={selectedUsers}
										onChange={setSelectedUsers}
										placeholder="Select participants..."
									/>
									<button className="save-btn" onClick={handleAddParticipants}>
										Save
									</button>
								</div>
							)}
						</>
					)}
				</>
			)}
		</div>
	);
}
