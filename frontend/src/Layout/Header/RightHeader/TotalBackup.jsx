import SvgIcon from '../../../Components/Common/Component/SvgIcon';
import axios from "axios";

const TotalBackup = () => {

  const onBackupHandler = (e) => {
      e.preventDefault()
      axios.get('https://arcflot.ru/backend/index.php?mod=backup-all')
      window.location.reload()
  }

  return (
    <li>
      <div>
        <a href="#" onClick={onBackupHandler}>
          <SvgIcon iconId='reset' />
        </a>
      </div>
    </li>
  );
};

export default TotalBackup;
