import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

import Loader from "../../components/Loader";
import { useProfileMutation } from "../../redux/api/usersApiSlice";
import { setCredentials } from "../../redux/features/auth/authSlice";

const Profile = () => {
  const [username, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);

  const [updateProfile, { isLoading: loadingUpdateProfile }] =
    useProfileMutation();

  useEffect(() => {
    if (userInfo) {
      setUserName(userInfo.username || "");
      setEmail(userInfo.email || "");
    }
  }, [userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    try {
      const res = await updateProfile({
        _id: userInfo._id,
        username,
        email,
        password,
      }).unwrap();
      dispatch(setCredentials({ ...res }));
      toast.success("Profile updated successfully");
    } catch (err) {
      toast.error(err?.data?.message || err.error || "Update failed");
    }
  };

  if (!userInfo) {
    return <Loader />;
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-screen px-4 py-12 bg-gradient-to-br from-gray-900 to-gray-950 text-white">
      <div className="w-full max-w-md bg-neutral-900 shadow-md rounded-xl p-6">
        <h2 className="text-2xl font-bold mb-6 text-center">Update Profile</h2>
        <form onSubmit={submitHandler}>
          <div className="mb-4">
            <label className="block text-sm mb-2">Name</label>
            <input
              type="text"
              placeholder="Enter name"
              className="w-full p-3 rounded bg-neutral-800 border border-neutral-700 focus:outline-none focus:ring-2 focus:ring-pink-500"
              value={username}
              onChange={(e) => setUserName(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm mb-2">Email Address</label>
            <input
              type="email"
              placeholder="Enter email"
              className="w-full p-3 rounded bg-neutral-800 border border-neutral-700 focus:outline-none focus:ring-2 focus:ring-pink-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm mb-2">Password</label>
            <input
              type="password"
              placeholder="Enter password"
              className="w-full p-3 rounded bg-neutral-800 border border-neutral-700 focus:outline-none focus:ring-2 focus:ring-pink-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm mb-2">Confirm Password</label>
            <input
              type="password"
              placeholder="Confirm password"
              className="w-full p-3 rounded bg-neutral-800 border border-neutral-700 focus:outline-none focus:ring-2 focus:ring-pink-500"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <div className="flex justify-between">
            <button
              type="submit"
              className="bg-pink-500 hover:bg-pink-600 text-white font-semibold py-2 px-4 rounded"
            >
              Update
            </button>

            <Link
              to="/user-orders"
              className="bg-pink-600 hover:bg-pink-700 text-white font-semibold py-2 px-4 rounded"
            >
              My Orders
            </Link>
          </div>

          {loadingUpdateProfile && (
            <div className="mt-4">
              <Loader />
            </div>
          )}
        </form>
      </div>
    </main>
  );
};

export default Profile;
