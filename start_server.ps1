 $ServiceName = 'Mysql'
 $arrService = Get-Service -Name $ServiceName

 if($arrService -ne 'Running'){
     Start-Service $ServiceName
 }

 npm run express