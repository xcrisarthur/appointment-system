import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import moment from "moment-timezone";
import "../css/AppointmentList.css";

export default function AppointmentList() {
	const [items, setItems] = useState([]);
	const [user, setUser] = useState(null);
	const [editingUser, setEditingUser] = useState(false);
	const [newUsername, setNewUsername] = useState("");
	const [newName, setNewName] = useState("");
	const [newTZ, setNewTZ] = useState("");
	const [allTimezones, setAllTimezones] = useState([]);
	const navigate = useNavigate();

	useEffect(() => {
		// ambil semua timezone dari moment-timezone
		setAllTimezones(moment.tz.names());

		// ambil data user
		api
			.get("/api/auth/me")
			.then((res) => {
				const u = res.data.user;
				setUser(u);
				setNewUsername(u.username);
				setNewName(u.name);
				setNewTZ(u.preferred_timezone || "UTC");
			})
			.catch(() => alert("Gagal ambil data user"));

		// ambil semua user
		api
			.get("/users")
			.then((res) => {
				const map = {};
				res.data.forEach((u) => (map[u.id] = u));
			})
			.catch(() => alert("Gagal ambil daftar user"));

		fetchAppointments();
	}, []);

	const fetchAppointments = () => {
		api
			.get("/appointments/me")
			.then((res) => setItems(res.data))
			.catch(() => alert("Gagal ambil appointments"));
	};

	const handleLogout = () => {
		localStorage.removeItem("token");
		navigate("/login");
	};

	// === FORMAT WAKTU YANG BENAR ===
	const DISPLAY_FMT = "YYYY-MM-DD HH:mm";
	const formatDateTime = (isoString, tz) => {
		return moment.utc(isoString).tz(tz).format(DISPLAY_FMT);
	};

	const handleDeleteAppointment = async (appointmentId) => {
		if (!window.confirm("Apakah Anda yakin ingin menghapus appointment ini?"))
			return;
		try {
			await api.delete(`/appointments/${appointmentId}`);
			alert("Appointment berhasil dihapus");
			fetchAppointments();
		} catch (err) {
			console.error("Gagal menghapus appointment:", err);
			alert("Gagal menghapus appointment");
		}
	};

	const handleUpdateUser = async () => {
		if (!user) return;
		try {
			const payload = {
				name: newName,
				username: newUsername,
				preferred_timezone: newTZ,
			};
			await api.put(`/users/${user.sub}`, payload);
			alert("Data user berhasil diperbarui");
			setUser({ ...user, ...payload });
			setEditingUser(false);
		} catch (err) {
			console.error("Gagal update user:", err);
			alert("Gagal update user");
		}
	};

	return (
		<div className="container">
			<header className="header">
				<h1>My Appointments</h1>
				<div className="header-actions">
					<Link to="/appointments/create" className="button-create">
						+ Create
					</Link>
					<button onClick={handleLogout} className="button-logout">
						Logout
					</button>
				</div>
			</header>

			{user && (
				<div className="user-info">
					{editingUser ? (
						<div className="edit-user-form">
							<input
								type="text"
								value={newName}
								onChange={(e) => setNewName(e.target.value)}
								placeholder="Name"
								className="tz-input"
							/>
							<input
								type="text"
								value={newUsername}
								onChange={(e) => setNewUsername(e.target.value)}
								placeholder="Username"
								className="tz-input"
							/>
							<select
								value={newTZ}
								onChange={(e) => setNewTZ(e.target.value)}
								className="tz-input">
								{allTimezones.map((tz) => (
									<option key={tz} value={tz}>
										{tz}
									</option>
								))}
							</select>
							<button onClick={handleUpdateUser} className="tz-save-btn">
								Save
							</button>
							<button
								onClick={() => setEditingUser(false)}
								className="tz-cancel-btn">
								Cancel
							</button>
						</div>
					) : (
						<div className="user-details">
							<h1>Hi, {user.username}</h1>
							<div className="user-timezone">
								<span>Your Time Zone is: {user.preferred_timezone}</span>
								<button
									onClick={() => setEditingUser(true)}
									className="tz-edit-btn">
									Edit
								</button>
							</div>
						</div>
					)}
				</div>
			)}

			<ul className="appointment-list">
				{items.length > 0 ? (
					items.map((a) => {
						// console.log("Appointment data:", a);
						return (
							<li key={a.id} className="appointment-item">
								{/* Title */}
								<div className="appointment-title">{a.title}</div>

								{/* Label waktu */}
								<div className="appointment-time">
									<strong>Waktu Janji Temu</strong>
									<div>
										{formatDateTime(
											a.start,
											a.creator?.preferred_timezone || "UTC"
										)}{" "}
										→{" "}
										{formatDateTime(
											a.end,
											a.creator?.preferred_timezone || "UTC"
										)}{" "}
										(Waktu {a.creator?.preferred_timezone || "UTC"})
									</div>

									{/* Tambahan: Waktu Anda */}
									{user && (
										<div className="appointment-user-time">
											<strong>Waktu Anda</strong>
											<div>
												{formatDateTime(
													a.start,
													user.preferred_timezone || "UTC"
												)}{" "}
												→{" "}
												{formatDateTime(
													a.end,
													user.preferred_timezone || "UTC"
												)}{" "}
												(Waktu {user.preferred_timezone || "UTC"})
											</div>
										</div>
									)}
								</div>

								<div className="appointment-actions">
									<Link
										to={`/appointments/${a.id}/participants`}
										className="participant-link">
										View Participants
									</Link>
									<button
										className="delete-appointment-btn"
										onClick={() => handleDeleteAppointment(a.id)}>
										Delete
									</button>
								</div>
							</li>
						);
					})
				) : (
					<li className="no-appointments">Belum ada appointment.</li>
				)}
			</ul>
		</div>
	);
}
