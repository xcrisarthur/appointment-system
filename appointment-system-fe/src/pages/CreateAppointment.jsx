import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { jwtDecode } from "jwt-decode";
import Select from "react-select";
import moment from "moment-timezone";
import "../css/CreateAppointment.css";

export default function CreateAppointment() {
	const [title, setTitle] = useState("");
	const [start, setStart] = useState("");
	const [end, setEnd] = useState("");
	const [participants, setParticipants] = useState([]);
	const [users, setUsers] = useState([]);
	const [currentUser, setCurrentUser] = useState(null);
	const navigate = useNavigate();

	// Ambil semua users (buat pilihan participant)
	useEffect(() => {
		api
			.get("/users")
			.then((res) => setUsers(res.data))
			.catch(() => alert("Gagal ambil daftar user"));
	}, []);

	// Ambil user login (buat tahu preferred_timezone)
	useEffect(() => {
		const token = localStorage.getItem("token");
		if (token) {
			const decoded = jwtDecode(token);
			const userId = decoded.sub;

			api
				.get(`/users/${userId}`)
				.then((res) => setCurrentUser(res.data))
				.catch((err) => console.error("Gagal ambil user:", err));
		}
	}, []);

	// Validasi jam kerja (pakai timezone user)
	const isWithinWorkingHours = (dateString, tz) => {
		if (!dateString || !tz) return false;
		const m = moment.tz(dateString, tz);
		const hour = m.hour();
		return hour >= 8 && hour < 17;
	};

	// Konversi ke UTC sebelum dikirim
	const toUTC = (localDateTime, tz) => {
		return moment.tz(localDateTime, tz).utc().toISOString();
	};

	const submit = async (e) => {
		e.preventDefault();

		if (!currentUser) {
			alert("Data user belum siap. Coba lagi.");
			return;
		}

		// Validasi jam kerja
		if (
			!isWithinWorkingHours(start, currentUser.preferred_timezone) ||
			!isWithinWorkingHours(end, currentUser.preferred_timezone)
		) {
			alert(
				"Waktu hanya boleh dipilih antara 08:00 dan 17:00 (zona waktu Anda)."
			);
			return;
		}

		// Validasi end > start (pakai momen di timezone user)
		const startLocal = moment.tz(start, currentUser.preferred_timezone);
		const endLocal = moment.tz(end, currentUser.preferred_timezone);
		if (!endLocal.isAfter(startLocal)) {
			alert("Waktu selesai harus lebih besar dari waktu mulai.");
			return;
		}

		try {
			const token = localStorage.getItem("token");
			let userId = null;
			if (token) {
				const decoded = jwtDecode(token);
				userId = decoded.sub;
			}

			const payload = {
				title,
				start: toUTC(start, currentUser.preferred_timezone),
				end: toUTC(end, currentUser.preferred_timezone),
				creator_id: userId,
				participants: participants.map((p) => p.value),
			};

			// console.log("Payload yg dikirim:", payload);

			await api.post("/appointments", payload);
			alert("Appointment berhasil dibuat");
			navigate("/appointments");
		} catch (e) {
			console.error(
				"Error saat create appointment:",
				e.response?.data || e.message
			);
			alert(
				e.response?.data?.error ||
					e.response?.data?.message ||
					"Gagal membuat appointment"
			);
		}
	};

	const options = users.map((user) => ({
		value: user.id,
		label: `${user.name} (@${user.username})`,
	}));

	return (
		<div className="container">
			<button
				className="back-btn"
				onClick={() => navigate(-1)}
				style={{
					marginBottom: "15px",
					padding: "8px 16px",
					borderRadius: "6px",
					border: "none",
					backgroundColor: "#6c757d",
					color: "white",
					cursor: "pointer",
				}}>
				&larr; Back
			</button>

			<h1>Create Appointment</h1>
			<form onSubmit={submit}>
				<input
					type="text"
					placeholder="Title"
					value={title}
					onChange={(e) => setTitle(e.target.value)}
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

				<label>Participants</label>
				<Select
					isMulti
					options={options}
					value={participants}
					onChange={setParticipants}
					placeholder="Select participants..."
				/>

				<button type="submit">Create</button>
			</form>
		</div>
	);
}
