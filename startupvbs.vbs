Set fso = CreateObject("Scripting.FileSystemObject")
Set shell = CreateObject("WScript.Shell")

' Get folder path of this .vbs file
scriptDir = fso.GetParentFolderName(WScript.ScriptFullName)

' Build the full path to your batch file relative to this script
batchFile = scriptDir & "\startup.bat"

' Run it hidden (0 = hidden, False = don’t wait)
shell.Run Chr(34) & batchFile & Chr(34), 0, False
