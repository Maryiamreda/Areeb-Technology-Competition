// app/admin/dashboard/page.tsx
"use client";

import { ThemeContext } from "@/context/ThemeProvider";
import { useContext } from "react";
import { useFormState } from "react-dom";
import { addEvent, EventState } from "./action";

const initialState: EventState = {
  errors: {},
  success: false
};

export default  function AdminDashboard() {
      const [state, formAction] = useFormState(addEvent, initialState);

      const { elementColor, theme } = useContext(ThemeContext);

  return (



    <form action={formAction}   className='m-5 w-full text-start  flex flex-col items-center justify-center  '>
            <h2 className='  text-5xl font-bold mb-4'>Add Event</h2>
            <div className='admin-login px-8 py-8 border rounded w-full max-w-4xl   text-start' 
            style={{backgroundColor: elementColor , color: theme === "light" ? "hsl(235, 19%, 35%)" : "white", borderColor: theme === "light" ? "hsl(233, 11%, 84%)" : "hsl(234deg 39% 85% / 33%)",
                }}
            >
                <div className='flex items-center gap-4 mb-8 text-gray-500 '>
                    <label htmlFor="image">
       <img src="/icons/upload_area.svg" className="w-16 cursor-pointer bg-gray-100 rounded-full" />
                    </label>
                    <input type='file'  id="image" 
              name="image"  hidden  />
                    <p>Upload Event <br /> Image </p>
                </div>
                <div className='flex flex-col lg:flex-row items-start gap-10 text-gray-600'>
                    <div className='w-full lg:flex-1 flex flex-col gap-4'>
                        <div className='flex-1 flex flex-col gap-1'>
                            <label>Event name</label>
                            <input
                                type='text'
                                id="name"
                  name="name"
                                className='border rounded px-3 py-2'
                                placeholder="Enter Event name"
                            />
                        </div>
                        <div className='flex-1 flex flex-col gap-1'>
                            <label>Organizer Email </label>
                            <input
                                type='email'
                                 id="organizerEmail"
                  name="organizerEmail"
                                className='border rounded px-3 py-2'
                                placeholder="Enter Organizer's email"
                               
                            />
                        </div>
                        {/* <div className='flex-1 flex flex-col gap-1'>
                            <label>Total Audience Limit</label>
                            <input
                                type='text'
                                 id="totalAudienceLimit"
                     name="totalAudienceLimit"
                                className='border rounded px-3 py-2'
                                placeholder="Enter Audience Limit"
                               
                            />
                        </div> */}
                        <div className='flex-1 flex flex-col gap-1'>
                            <label>Category</label>
                            <select
                                className='border rounded px-3 py-2'
                               id="category"
                  name="category"
                            >
                                <option value="" disabled>Select category of the event</option>
                                <option value="music">Music</option>
                  <option value="educational">Educational</option>
                  <option value="business">Business</option>
                  <option value="technology">Technology</option>
                  <option value="health">Health</option>
                  <option value="arts">Arts</option>
                  <option value="sports">Sports</option>
                  <option value="entertainment">Entertainment</option>
                  <option value="science">Science</option>
                  <option value="networking">Networking</option>
                  <option value="charity">Charity</option>
                  <option value="fashion">Fashion</option>
                  <option value="cultural">Cultural</option>
                            </select>
                        </div>
                        <div className='flex-1 flex flex-col gap-1'>
                            <label>Fees</label>
                            <input
                                type='text'
                                 id="fees"
                  name="fees"
                                className='border rounded px-3 py-2'
                                placeholder="Enter Event fees"
                               
                            />
                        </div>
                    </div>
                    <div className='w-full lg:flex-1 flex flex-col gap-4'>
                        <div className='flex-1 flex flex-col gap-1'>
                            <label>Event Type</label>
                            <select
                                className='border rounded px-3 py-2'
                                id="eventType"
                  name="eventType"
                            >
                                <option value="" disabled>Select Event Type</option>
                                 <option value="in person">In Person</option>
                  <option value="online">Online</option>
                                
                            </select>
                        </div>
                        

                        <div className='flex-1 flex flex-col gap-1'>
                            <label>Event Date</label>
                            <input
                                type='date'
                                 id="date"
                  name="date"
                                className='border rounded px-3 py-2'
                                placeholder="Time of the Event"
                               
                            />
                           
                        </div>


                        <div className='flex-1 flex flex-col gap-1'>
                            <label>Event location</label>
                            <input
                                type='text'
                                  id="location"
                  name="location"
                                className='border rounded px-3 py-2'
                                placeholder="Address of the event /or online platfom if online "
                               
                            />
                           
                        </div>

                        {/* <div className='flex-1 flex flex-col gap-1'>
                            <label>Registration Deadline</label>
                            <input
                                type='date'
                                 id="registrationDeadline"
                  name="registrationDeadline"
                                className='border rounded px-3 py-2'
                                placeholder="Enter Registration Deadline"
                             
                            />
                        </div> */}
                       
                    </div>
                </div>
                <div className='flex-1 flex flex-col gap-1 text-gray-600'>
                    <label className='mt-4 mb-2'>Event Description</label>
                    <textarea
                     id="description"
              name="description"
                        placeholder="Write a brief description about your event"
                        className='w-full px-4 pt-2 border rounded'
                       
                    />
                </div>
                <button type='submit' className=' bg-emerald-800 px-10 py-3 mt-4 text-white rounded-full cursor-pointer'>Add Event</button>
            </div>
        </form>
  );
}




  
  
