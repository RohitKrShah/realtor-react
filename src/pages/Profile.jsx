import React from 'react'
import { useState } from 'react'
import {getAuth,updateProfile} from 'firebase/auth'
import {doc,updateDoc}from 'firebase/firestore'
import { useNavigate } from 'react-router';
import {toast} from 'react-toastify'
import {db } from '../firebase'
import {FcHome} from 'react-icons/fc'
import { Link } from 'react-router-dom';
import {
  collection,
  getDocs,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { useEffect } from "react";
import ListingItem from "../components/ListingItem";
export default function Profile() {
  const auth=getAuth();
  const navigate=useNavigate()
const [changeDetail,setchangeDetail]=useState(false)
const [listings, setListings] = useState(null);
const [loading, setLoading] = useState(true);
const[formData,setFormData]=useState({
  name:auth.currentUser.displayName,
  email:auth.currentUser.email,
})
const{name,email}=formData

function onLogout(){
auth.signOut()
navigate("/")
}
function onChange(e){
  setFormData((prevState)=>({
    ...prevState,
    [e.target.id]:e.target.value,
  }))
}

async function onSubmit(){
try {
  if(auth.currentUser.displayName!==name){
    //update the display name in firebase auth

    await updateProfile(auth.currentUser,{
      displayName:name,
    })
    //update name in firestore

    const docRef=doc(db,"users",auth.currentUser.uid)
await updateDoc(docRef,{
  name,
})
  }
  toast.success("Profile details updated")
} catch (error) {
  toast.error("Could not update the profile details")
  
}
}
useEffect(() => {
  async function fetchUserListings() {
    const listingRef = collection(db, "listings");
    const q = query(
      listingRef,
      where("userRef", "==", auth.currentUser.uid),
      orderBy("timestamp", "desc")
    );
    const querySnap = await getDocs(q);
    let listings = [];
    querySnap.forEach((doc) => {
      return listings.push({
        id: doc.id,
        data: doc.data(),
      });
    });
    setListings(listings);
    setLoading(false);
  }
  fetchUserListings();
}, [auth.currentUser.uid]);
  return (
    <>
      <section className="max-w-6xl mx-auto flex justify-center items-center flex-col">
        <h1 className="text-3xl text-center mt-6 font-bold">My Profile</h1>
        <div className="w-full md:w-[50%] mt-6 px-3">
          <form>
            <input
              type="text"
              id="name"
              value={name}
              disabled={!changeDetail}
              onChange={onChange}
              className={`w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition ease-in-out mb-6 ${
                changeDetail && "bg-red-200 focus:bg-red-200"
              }`}
            />

            <input
              type="email"
              id="email"
              value={email}
              disabled
              className="w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition ease-in-out mb-6"
            />

            <div className="flex justify-between whitespace-nowrap text-sm sm:text-lg mb-6">
              <p className="flex items-center ">
                Do you want to change your name?
                <span
                  onClick={() => {
                    changeDetail && onSubmit();
                    setchangeDetail((prevState) => !prevState);
                  }}
                  className="text-red-600 hover:text-red-700 transition ease-in-out duration-200 ml-1 cursor-pointer"
                >
                  {changeDetail ? "Apply change" : "Edit"}
                </span>
              </p>
              <p
                onClick={onLogout}
                className="text-blue-600 hover:text-blue-800 transition duration-200 ease-in-out cursor-pointer"
              >
                Sign out
              </p>
            </div>
          </form>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white uppercase px-7 py-3 text-sm font-medium rounded shadow-md hover:bg-blue-700 transition duration-150 ease-in-out hover:shadow-lg active:bg-blue-800 "
          >
            <Link
              to="/create-listing"
              className="flex justify-center items-center "
            >
              <FcHome className="mr-2 text-3xl  bg-red-200 rounded-full p-1 border-2 " />
              Sell or rent your home
            </Link>
          </button>
        </div>
      </section>
      <div className="max-w-6xl px-3 mt-6 mx-auto">
        {!loading && listings.length > 0 && (
          <>
            <h2 className="text-2xl text-center font-semibold mb-6">
              My Listings
            </h2>
            <ul className="sm:grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
              {listings.map((listing) => (
                <ListingItem
                  key={listing.id}
                  id={listing.id}
                  listing={listing.data}
                />
              ))}
            </ul>
          </>
        )}
      </div>
    </>
  );
}
