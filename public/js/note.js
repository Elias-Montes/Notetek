//add note
// update note
// delete note

$(document).ready(function () {
        $('.modal').modal();
    // Function to show the create/edit note modal
    function showNoteModal(title, content, noteId) {
        $("#note-title").val(title);
        $("#note-content").val(content);
        $("#save-note-btn").attr("data-note-id", noteId);
        $("#note-modal").show();
    }

    // Function to hide all modals
    function hideModals() {
        $("#note-modal").hide();
        $("#share-username-modal").hide();
        $("#share-qr-modal").hide();
    }

    // Load notes from the server and display them on the page
    function loadNotes() {
        // Call your API to get the user's notes
        // Example API call using jQuery:
        $.ajax({
            url: "/api/notes",
            method: "GET",
            success: function (data) {
                // Assuming the response is an array of notes objects
                data.forEach(function (note) {
                    $("#notes-list").append(`
                            <div class="note" data-note-id="${note.id}">
                                <h3>${note.title}</h3>
                                <p>${note.content}</p>
                                <button class="edit-btn">Edit</button>
                                <button class="delete-btn">Delete</button>
                                <button class="share-username-btn">Share via Username</button>
                                <button class="share-qr-btn">Share via QR Code</button>
                            </div>
                        `);
                });
            },
            error: function (error) {
                console.error("Error loading notes:", error);
            }
        });
    }

    // Open the create note modal when clicking "New Note" button
    $("#new-note-btn").click(function () {
        showNoteModal("", "", ""); // Empty values for creating a new note
    });

    // Close modals when clicking the close button
    $(".close-btn").click(function () {
        hideModals();
    });

    // Save the note when clicking the "Save" button in the note modal
    $("#save-note").submit(function (event) {
        event.preventDefault();
        const noteId = $(this).attr("data-note-id");
        const title = $("#note-title").val();
        const content = $("#note-content").val();

        // Calling jQuery API to save/update the note
        
        $.ajax({
            url: `/api/user/notes/`,
            method: noteId ? "PUT" : "POST",
            data: { title: title, note: content },
            success: function (data) {
                hideModals();
                location.reload(); // Refresh the page to display updated notes
            },
            error: function (error) {
                console.error("Error saving the note:", error);
            }
        });
    });

    // Edit a note when clicking the "Edit" button
    $(document).on("click", ".edit-btn", function () {
        const noteId = $(this).closest(".note").attr("data-note-id");
        const title = $(this).siblings("h4").text();
        const content = $(this).siblings("p").text();
        showNoteModal(title, content, noteId);
    });

    // Delete a note when clicking the "Delete" button
    $(document).on("click", ".delete-btn", function () {
        const noteId = $(this).closest(".note").attr("data-note-id");
        // Calling jQuery API to delete the note
        
        $.ajax({
            url: `/api/notes/${noteId}`,
            method: "DELETE",
            success: function (data) {
                // Remove the note element from the page
                $(`[data-note-id="${noteId}"]`).remove();
            },
            error: function (error) {
                console.error("Error deleting the note:", error);
            }
        });
    });

    // Show the "Share via Username" modal when clicking the button
    $(document).on("click", ".share-username-btn", function () {
        const noteId = $(this).closest(".note").attr("data-note-id");
        // Add your code to show the "Share via Username" modal
        // Can use $("#share-username-modal").show();
    });

    // Show the "Share via QR Code" modal when clicking the button
    $(document).on("click", ".share-qr-btn", function () {
        const noteId = $(this).closest(".note").attr("data-note-id");
        // Add your code to show the "Share via QR Code" modal
        // Can use $("#share-qr-modal").show();

        // Generate and display the QR code for the note
        const qrCodeDiv = document.getElementById("qr-code");
        new QRCode(qrCodeDiv, {
            text: `https://example.com/notes/${noteId}`, // Replace with the URL of the note
            width: 128,
            height: 128
        });
    });

    // Call the function to load and display the user's notes
    loadNotes();
});

