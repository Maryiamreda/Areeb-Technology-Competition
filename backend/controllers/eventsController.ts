import { db } from "../index";
import * as schema from '../db/schema';
import { eq, SQL } from 'drizzle-orm';
import { v2 as cloudinary } from 'cloudinary';




cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export type EventData = {
  name: string;
  organizerEmail: string;
  category: string;
  fees: number;
  eventType: string;
  date: string;
  location?: string;
  description: string;
  image?: File;
};


export async function deleteEvent(eventId:number){
try{
    await db.delete(schema.eventsTable).where(eq(schema.eventsTable.id, eventId)).returning();
    return { success: true, message: "Event deleted successfully" };

}catch(err:any){
   console.error("Error deleting event:", err);
    return { success: false, message: `Error deleting event: ${err.message}` };
}

}

export async function addEventToDb(data: EventData) {
  try {
    // Validate required fields
    if (!data.name || !data.organizerEmail ||  !data.category ||  !data.fees || !data.eventType || !data.date || !data.description || !data.image) {
      return {
        success: false,
        message: "All fields are required",
      };
    }

    // Upload image to cloudinary
    const buffer = await data.image.arrayBuffer();
    const base64Image = Buffer.from(buffer).toString('base64');
    const dataURI = `data:${data.image.type};base64,${base64Image}`;
    
    const imageUpload = await cloudinary.uploader.upload(dataURI, {
      resource_type: "image"
    });
    const imageUrl = imageUpload.secure_url;

   

    // Insert the event into the database
  const newEvent = await db.insert(schema.eventsTable).values({
  name: data.name,
  image: imageUrl,
  fees: data.fees,
  description: data.description,
  date: new Date(data.date).toISOString(),
  location: data.location || "",
  eventType: data.eventType ,
  eventCategory: data.category ,
  organizerEmail: data.organizerEmail,
}).returning();
    console.error("done Adding Event");

    return {
      success: true,
      message: "Event Added successfully",
    };
  } catch (err: any) {
    console.error("Error Adding Event", err);
    return {
      success: false,
      message: `Error adding event: ${err.message}`,
    };
  }
}


export async function getEvents(){
    try{
        const events = await db.select()
        .from(schema.eventsTable);
        return events;
    
    }catch(err){
        console.error("Error fetching Events", err);
        throw err;
    }
 }

 export async function getOnlineEvents(){
    try{
        const events = await db.select()
        .from(schema.eventsTable)
        .where(eq(schema.eventsTable.eventType, 'online'))

        return events;
    
    }catch(err){
        console.error("Error fetching Events", err);
        throw err;
    }
 }
 
 export async function getOfflineEvents(){
    try{
        const events = await db.select()
        .from(schema.eventsTable)
        .where(eq(schema.eventsTable.eventType, 'in person'))

        return events;
    
    }catch(err){
        console.error("Error fetching Events", err);
        throw err;
    }
 }

export async function getEventById(eventId: string) {
      const eventIdNumber = parseInt(eventId, 10);
       // Check if the eventIdNumber is a valid number
 if (isNaN(eventIdNumber)) {
      return null; 
    }
  try {
   const [event] = await db
      .select()
      .from(schema.eventsTable)
      .where(eq(schema.eventsTable.id, eventIdNumber))
      .limit(1);
    
    return event || null;
  } catch (error) {
    console.error(`Error fetching event with ID ${eventId}:`, error);
    throw new Error('Failed to fetch event details');
  }
}



 export async function editEventDB(eventId: number, updatedData: Partial<EventData>) {
  try {
    const event = await db.select()
      .from(schema.eventsTable)
      .where(eq(schema.eventsTable.id, eventId))
      .limit(1);

    if (!event || event.length === 0) {
      return {
        success: false,
        message: "Event not found",
      };
    }
console.log(event[0].name);
    let imageUrl = undefined;

    // Handle image upload if provided
    if (updatedData.image) {
      const buffer = await updatedData.image.arrayBuffer();
      const base64Image = Buffer.from(buffer).toString('base64');
      const dataURI = `data:${updatedData.image.type};base64,${base64Image}`;

      const imageUpload = await cloudinary.uploader.upload(dataURI, {
        resource_type: "image"
      });

      imageUrl = imageUpload.secure_url;
    }

     const dataToUpdate: any = {
      updated_at: new Date()
    };

    if (updatedData.name) dataToUpdate.name = updatedData.name;
    if (updatedData.organizerEmail) dataToUpdate.organizerEmail = updatedData.organizerEmail;
    if (updatedData.category) dataToUpdate.eventCategory = updatedData.category;
    if (updatedData.fees !== undefined) dataToUpdate.fees = updatedData.fees;
    if (updatedData.eventType) dataToUpdate.eventType = updatedData.eventType;
    if (updatedData.date) dataToUpdate.date = updatedData.date;

  if (updatedData.location) dataToUpdate.location = updatedData.location;
    if (updatedData.description) dataToUpdate.description = updatedData.description;
    if (imageUrl) dataToUpdate.image = imageUrl;

    const updatedEvent = await db.update(schema.eventsTable)
      .set(dataToUpdate)
      .where(eq(schema.eventsTable.id, eventId))
      .returning();

    return {
      success: true,
      message: "Event updated successfully",
      event: updatedEvent[0]
    };

  } catch (err: any) {
    console.error("Error Updating Event", err);
    return {
      success: false,
      message: `Error updating event: ${err.message}`,
    };
  }
}
function where(arg0: SQL<unknown>) {
  throw new Error("Function not implemented.");
}

