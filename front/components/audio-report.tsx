"use client"

import { useState, useRef, useEffect } from "react"
import { Mic, Square, Send, Loader2, MapPin, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface AudioReportProps {
  onReportSubmitted: (reportData: any) => void
}

export default function AudioReport({ onReportSubmitted }: AudioReportProps) {
  const [isRecording, setIsRecording] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [processingStage, setProcessingStage] = useState<string | null>(null)
  const [processingProgress, setProcessingProgress] = useState(0)
  const [transcription, setTranscription] = useState("")
  const [extractedLocation, setExtractedLocation] = useState("")
  const [extractedEmergency, setExtractedEmergency] = useState("")
  const [extractedSeverity, setExtractedSeverity] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })

      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      audioChunksRef.current = []

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data)
        }
      }

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" })
        const audioUrl = URL.createObjectURL(audioBlob)
        setAudioBlob(audioBlob)
        setAudioUrl(audioUrl)

        processAudio(audioBlob)
      }

      mediaRecorder.start()
      setIsRecording(true)

      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1)
      }, 1000)
    } catch (error) {
      console.error("Error accessing microphone:", error)
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)

      if (timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }

      mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop())
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0")
    const secs = (seconds % 60).toString().padStart(2, "0")
    return `${mins}:${secs}`
  }

  const processAudio = async (audioBlob: Blob) => {
    setProcessingStage("transcribing")
    simulateProgress(0, 33, async () => {
      const formData = new FormData()
      formData.append("file", audioBlob, "recording.wav")

      try {
        const response = await fetch("https://alive-cheetah-precisely.ngrok-free.app/voice/process-audio/", {
          method: "POST",
          body: formData,
          headers: {
            // Add any required headers here, such as authentication tokens
          },
        })

        if (!response.ok) {
          throw new Error("Failed to process audio")
        }

        const data = await response.json()

        // Assuming the API returns the following structure:
        // {
        //   transcription: "Transcribed text",
        //   location: "Extracted location",
        //   emergency: "Extracted emergency type",
        //   severity: "Extracted severity level"
        // }

        setTranscription(data.transcription)

        setProcessingStage("extracting")
        simulateProgress(33, 66, () => {
          setExtractedLocation(data.location)
          setExtractedEmergency(data.emergency)
          setExtractedSeverity(data.severity)

          setProcessingStage("verifying")
          simulateProgress(66, 100, () => {
            setProcessingStage("completed")
          })
        })
      } catch (error) {
        console.error("Error processing audio:", error)
        setProcessingStage("error")
      }
    })
  }

  const simulateProgress = (start: number, end: number, callback: () => void) => {
    let current = start
    const interval = setInterval(() => {
      current += Math.random() * 5
      if (current >= end) {
        current = end
        clearInterval(interval)
        callback()
      }
      setProcessingProgress(current)
    }, 200)
  }

  const submitReport = () => {
    setIsSubmitting(true)

    setTimeout(() => {
      const reportData = {
        audioUrl,
        transcription,
        location: extractedLocation,
        emergencyType: extractedEmergency,
        severity: extractedSeverity,
        timestamp: new Date().toISOString(),
        coordinates: [40.7128, -74.006], // Simulated coordinates
        status: "new",
      }

      onReportSubmitted(reportData)
      setIsSubmitting(false)
      setIsSubmitted(true)
    }, 1500)
  }

  const resetForm = () => {
    setAudioBlob(null)
    setAudioUrl(null)
    setProcessingStage(null)
    setProcessingProgress(0)
    setTranscription("")
    setExtractedLocation("")
    setExtractedEmergency("")
    setExtractedSeverity("")
    setRecordingTime(0)
    setIsSubmitted(false)
  }

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl)
      }
    }
  }, [audioUrl])

  return (
    <div className="w-full max-w-3xl mx-auto">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Mic className="mr-2 h-5 w-5" />
            Voice Emergency Report
          </CardTitle>
          <CardDescription>
            Record your situation and location. AI will extract key information to help rescue teams find you.
          </CardDescription>
        </CardHeader>

        <CardContent>
          {!audioBlob && !isSubmitted ? (
            <div className="flex flex-col items-center justify-center py-10">
              <div
                className={`relative rounded-full ${isRecording ? "bg-red-100 animate-pulse" : "bg-gray-100"} p-8 mb-4`}
              >
                <Button
                  variant={isRecording ? "destructive" : "default"}
                  size="icon"
                  className={`h-16 w-16 rounded-full ${isRecording ? "bg-red-500" : ""}`}
                  onClick={isRecording ? stopRecording : startRecording}
                >
                  {isRecording ? <Square className="h-8 w-8" /> : <Mic className="h-8 w-8" />}
                </Button>

                {isRecording && (
                  <span className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-white px-2 py-1 rounded-full text-xs font-medium text-red-500">
                    {formatTime(recordingTime)}
                  </span>
                )}
              </div>

              <p className="text-center text-gray-500 mt-4">
                {isRecording
                  ? "Recording... Press the stop button when finished."
                  : "Press the microphone button to start recording your emergency situation."}
              </p>

              <div className="mt-6 text-sm text-gray-500 max-w-md text-center">
                <p>Speak clearly and include:</p>
                <ul className="list-disc list-inside mt-2 text-left">
                  <li>Your exact location (street, landmarks)</li>
                  <li>The type of emergency (flood, fire, etc.)</li>
                  <li>How many people are with you</li>
                  <li>Any immediate dangers or medical needs</li>
                </ul>
              </div>
            </div>
          ) : isSubmitted ? (
            <div className="flex flex-col items-center justify-center py-10">
              <div className="bg-green-100 p-6 rounded-full mb-4">
                <CheckCircle2 className="h-16 w-16 text-green-600" />
              </div>

              <h3 className="text-xl font-semibold text-center mb-2">Report Submitted Successfully</h3>
              <p className="text-center text-gray-500 mb-6">
                Your emergency has been reported and rescue teams have been notified. Stay in your location if it's safe
                to do so.
              </p>

              <Button onClick={resetForm}>Submit Another Report</Button>
            </div>
          ) : (
            <div className="space-y-6">
              {processingStage !== "completed" ? (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Processing Your Audio</h3>
                  <Progress value={processingProgress} className="h-2" />
                  <p className="text-sm text-gray-500">
                    {processingStage === "transcribing" && "Transcribing your audio..."}
                    {processingStage === "extracting" && "Extracting key information..."}
                    {processingStage === "verifying" && "Verifying location and emergency details..."}
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <Label>Audio Recording</Label>
                      {audioUrl && (
                        <audio controls src={audioUrl} className="w-full max-w-md">
                          Your browser does not support the audio element.
                        </audio>
                      )}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="transcription">Transcription</Label>
                    <Textarea
                      id="transcription"
                      value={transcription}
                      onChange={(e) => setTranscription(e.target.value)}
                      className="mt-1 min-h-[100px]"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="location">Location</Label>
                      <div className="flex mt-1">
                        <Input
                          id="location"
                          value={extractedLocation}
                          onChange={(e) => setExtractedLocation(e.target.value)}
                          className="rounded-r-none"
                        />
                        <Button variant="outline" className="rounded-l-none border-l-0">
                          <MapPin className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="emergency-type">Emergency Type</Label>
                      <Select value={extractedEmergency} onValueChange={setExtractedEmergency}>
                        <SelectTrigger id="emergency-type" className="mt-1">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Flood">Flood</SelectItem>
                          <SelectItem value="Fire">Fire</SelectItem>
                          <SelectItem value="Earthquake">Earthquake</SelectItem>
                          <SelectItem value="Hurricane">Hurricane</SelectItem>
                          <SelectItem value="Medical">Medical Emergency</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="severity">Severity</Label>
                      <Select value={extractedSeverity} onValueChange={setExtractedSeverity}>
                        <SelectTrigger id="severity" className="mt-1">
                          <SelectValue placeholder="Select severity" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Critical">Critical - Life Threatening</SelectItem>
                          <SelectItem value="High">High - Immediate Assistance</SelectItem>
                          <SelectItem value="Medium">Medium - Needs Assistance</SelectItem>
                          <SelectItem value="Low">Low - Non-urgent</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>

        {audioBlob && processingStage === "completed" && !isSubmitted && (
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={resetForm}>
              Cancel
            </Button>
            <Button
              onClick={submitReport}
              disabled={isSubmitting}
              className={extractedSeverity === "Critical" ? "bg-red-600 hover:bg-red-700" : ""}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Submit Emergency Report
                </>
              )}
            </Button>
          </CardFooter>
        )}
      </Card>
    </div>
  )
}