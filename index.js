const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 3000;
const mongoose = require("mongoose");
const { ContactModel } = require("./db/models");

main().catch((err) => console.log(err));

async function main() {
  await mongoose.connect("mongodb://localhost:27017/contact");
}
app.use(cors())
app.use(express.json());

app.get("/", (req, res) => {
  return res.json({ msg: "hello" });
});

// create contact
app.post("/create", async (req, res) => {
  const { name, number, email } = req.body;

  const response = await ContactModel.findOne({
    email,
  });

  if (response) {
    return res.json({ msg: "contact with this email already exists" });
  } else {
    const resp2 = await ContactModel.create({
      contactName: name,
      contactNumber: number,
      email,
    });

    return res.json({
      msg: "contact added successfully",
    });
  }
});

//edit contacts
app.put("/edit", async (req, res) => {
  const { name, number, email } = req.body;

  const response = await ContactModel.findOne({
    email,
  });

  if (!response) {
    return res.json({ msg: "user doesnt exist" });
  } else {
    const res2 = await ContactModel.findOneAndUpdate(
      { email },
      { contactName: name, contactNumber: number, email }
    );

    return res.json({ msg: "user updated successfully" });
  }
});

//delete user
app.delete("/delete", async (req, res) => {
  const { email } = req.body; // Extract email from the request body

  try {
    // Check if the user exists
    const response1 = await ContactModel.findOne({ email });

    if (!response1) {
      return res.json({ msg: "That user doesn't exist" });
    }

    // Delete the user from the database
    await ContactModel.deleteOne({ email });

    return res.json({ msg: "user deleted" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ msg: "Internal Server Error" });
  }
});


//search users
app.post("/search", async (req, res) => {
  const { name } = req.body;

  try {
    // If name is provided, search using regex; otherwise, return all contacts
    const query = name ? { contactName: { $regex: name, $options: "i" } } : {};

    // Perform the database search
    const contacts = await ContactModel.find(query);

    return res.status(200).json(contacts);
  } catch (error) {
    console.error("Error searching contacts:", error);
    return res
      .status(500)
      .json({ msg: "An error occurred while searching contacts" });
  }
});
// Start the server
app.listen(PORT, () => {
  console.log("Running on port " + PORT);
});

