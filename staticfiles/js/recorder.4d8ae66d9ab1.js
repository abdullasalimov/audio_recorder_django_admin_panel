$( document ).ready(function() {
    $('input[type=submit]').click(async function(e) {
        let url = $('audio').attr('src')
        if(url != undefined){
            const fileInput = document.querySelector('input[type="file"]');
            console.log(url);
            let file = await fetch(url)
                    .then(r => r.blob())
                    .then(blobFile => new File([blobFile], "user_recording.mp3", { type: "mp3" }))

            console.log(file);

            const dataTransfer = new DataTransfer();
            dataTransfer.items.add(file);
            fileInput.files = dataTransfer.files;
        }
        $('#word_form').submit()
    });
});

/**
 * Load when browser load completely
 */

// "use strict";
// {
//   $(document).ready(function ($) {
//     $(function () {
//       $("select[id*=media_type").each((i, e)=>{
//         $(e).bind("change", function (e) {
//           const _parent = $(this).parent("td").nextSibling;
//           console.log(_parent);
//         });
//       })
//       $(".inline-group .inline-related .delete input").each(function (i, e) {
//         $(e).bind("change", function (e) {
//           if (this.checked) {
//             // marked for deletion
//             $(this)
//               .parents("tr")
//               // .children("fieldset.module")
//               .addClass("disabled");
//           }
//         });
//       });
//     });
//   });
// }


// var audioFile = document.querySelectorAll("[data-django-audio-recorder]")[0];

const startRecording = function (
  thisButton,
  otherButton,
  objectId,
  targetField,
  ) {
  const $ = django.jQuery;
  // Access the microphone
  let chunks = [];
  navigator.mediaDevices
    .getUserMedia({ audio: true, video: false })
    .then((mediaStream) => {
      // Create a new MediaRecorder instance
      const mediaRecorder = new MediaRecorder(mediaStream);

      //Make the mediaStream global
      window.mediaStream = mediaStream;
      //Make the mediaRecorder global
      window.mediaRecorder = mediaRecorder;

      mediaRecorder.start();

      // Whenever (here when the recorder
      // stops recording) data is available
      // the MediaRecorder emits a "dataavailable"
      // event with the recorded media data.
      mediaRecorder.ondataavailable = (e) => {
        // Push the recorded media data to
        // the chunks array
        chunks.push(e.data);
      };

      // When the MediaRecorder stops
      // recording, it emits "stop"
      // event
      mediaRecorder.onstop = () => {
        /* A Blob is a File like object.
            In fact, the File interface is 
            based on Blob. File inherits the 
            Blob interface and expands it to
            support the files on the user's 
            systemThe Blob constructor takes 
            the chunk of media data as the 
            first parameter and constructs 
            a Blob of the type given as the 
            second parameter*/
        const blob = new Blob(chunks, {
          type: "audio/mpeg",
        });
        chunks = [];

        // Create a video or audio element
        // that stores the recorded media
        const recordedMedia = document.createElement("audio");
        recordedMedia.controls = true;

        // You can not directly set the blob as
        // the source of the video or audio element
        // Instead, you need to create a URL for blob
        // using URL.createObjectURL() method.
        const recordedMediaURL = URL.createObjectURL(blob);

        // Now you can use the created URL as the
        // source of the video or audio element
        recordedMedia.src = recordedMediaURL;

        // Create a download button that lets the
        // user download the recorded media
        const downloadButton = document.createElement("a");

        // Set the download attribute to true so that
        // when the user clicks the link the recorded
        // media is automatically gets downloaded.
        downloadButton.download = "Recorded-Media";

        downloadButton.href = recordedMediaURL;
        downloadButton.innerText = "Download it!";

        downloadButton.onclick = () => {
          /* After download revoke the created URL
                using URL.revokeObjectURL() method to 
                avoid possible memory leak. Though, 
                the browser automatically revokes the 
                created URL when the document is unloaded,
                but still it is good to revoke the created 
                URLs */
          URL.revokeObjectURL(recordedMedia);
        };

        const _parent = $(thisButton).parents("td");        
        _parent
        .append(recordedMedia, downloadButton);
        // audio.replaceWith(recordedMedia);
      };

      mediaRecorder.onerror = (event) => {
        console.log(event.error);
      };
      // document.getElementById(`${objectId}-record-status`).innerText = "Recording";

      thisButton.disabled = true;
      const stopButton = $(thisButton).siblings('button');
      stopButton.prop('disabled', false)
      console.log(stopButton);
    });
};

function stopRecording(thisButton, otherButton, recordStatus) {
  const $ = django.jQuery;
  // Stop the recording
  window.mediaRecorder.stop();

  // Stop all the tracks in the
  // received media stream
  window.mediaStream.getTracks().forEach((track) => {
    track.stop();
  });

  thisButton.disabled = true;
  const stopButton = $(thisButton).siblings("button");
  stopButton.prop("disabled", false);

  // document.getElementById(`${recordStatus}-record-status`).innerText =
  //   "Recording done!";
  // thisButton.disabled = true;
  // startButton = thisButton.prevElementSibling;
  // startButton.disabled = false;
}

// var promise = navigator.mediaDevices.getUserMedia({
//   audio: true,
//   video: false,
// });

// var recordButton = document.getElementById("js-record-button");
// var stopButton = document.getElementById("js-stop-button");
// var audio = document.getElementById("js-audio");
// var uploadSpan = document.getElementById("js-upload-span");
// var audioFile = document.querySelectorAll("[data-django-audio-recorder]")[0];

// promise.then(function (stream) {
//   var recorder = new MediaRecorder(stream);
//   recorder.chunks = [];

//   if (recordButton)
//     recordButton.addEventListener("click", function () {
//       recordButton.disabled = true;
//       stopButton.disabled = false;
//       audio.removeAttribute("src");
//       recorder.start();
//     });

//   if (stopButton)
//     stopButton.addEventListener("click", function () {
//       stopButton.disabled = true;
//       uploadSpan.classList.remove("hidden");
//       recorder.stop();
//     });

//   recorder.ondataavailable = function (e) {
//     this.chunks.push(e.data);
//   };

//   recorder.onstop = function (event) {
//     var blob = new Blob(this.chunks, { type: "audio/wav;" });
//     this.chunks = [];
//     var formData = new FormData();
//     formData.append("audio_file", blob, "replace-me.wav");
//     $.ajax({
//       type: "POST",
//       url: audioFile.dataset.url,
//       data: formData,
//       processData: false,
//       contentType: false,
//       success: function (data) {
//         uploadSpan.classList.add("hidden");
//         recordButton.disabled = false;
//         audioFile.value = data.id;
//         audio.src = data.url;
//       },
//       error: function (jqXHR, textStatus, errorThrown) {
//         uploadSpan.classList.add("hidden");
//         recordButton.disabled = false;
//         console.error("jqXHR:", jqXHR);
//         console.error("textStatus:", textStatus);
//         console.error("errorThrown:", errorThrown);
//       },
//     });
//   };
// });

// promise.catch(function (err) {
//   console.log(err.name);
// });

