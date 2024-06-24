import SvgIcon from '../../../Components/Common/Component/SvgIcon';

const Notifications = () => {
  return (
    <li>
      <div className='notification-box'>
        <a href="https://t.me/smpflot" target="_blank">
          <SvgIcon iconId='notification' />
        </a>
      </div>
    </li>
  );
};

export default Notifications;
