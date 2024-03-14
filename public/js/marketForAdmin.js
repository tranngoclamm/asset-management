// hiện checkbox khi click icon touch
function mutilChoose(){
    const checkboxes = document.querySelectorAll('.choose_asset');
    checkboxes.forEach((checkbox) => {
        checkbox.style.display='block';

      })
}

// ẩn checkbox khi không có checkbox nào được chọn
function chooseAsset(){
    const checkboxes = document.querySelectorAll('.choose_asset');
    let count = 0;
    checkboxes.forEach((checkbox) => {
        if(checkbox.checked){
            count++;
        }
      })
    if(count == 0){
        document.getElementById('delete-mutil-icon').style.display="none";
        document.getElementById('touch-icon').style.display="block";
        checkboxes.forEach((checkboxe) => {
            checkboxe.style.display='none';
        })
    } 
    else if (count > 0){ // hiện biểu tượng xóa 
        document.getElementById('touch-icon').style.display="none";
        document.getElementById('delete-mutil-icon').style.display="block";
    }
}

// xóa tài sản trên diễn đàn bằng checkbox
function deleteAssets(){
    const selectedIds = [];
    const checkboxes = document.querySelectorAll('.choose_asset');
    checkboxes.forEach((checkbox) => {
        if(checkbox.checked){
            const row = checkbox.closest('div.relative'); // lấy hàng đó để lấy thông tin id tài sản
            const idColumn = row.querySelector('div.asset_id').textContent;
            selectedIds.push(idColumn);
        }
      })
      document.getElementById('selectedIds').value = selectedIds;
      document.getElementById('DeleteForm').style.display = 'block'; // hiện cảnh báo xóa
      
}


